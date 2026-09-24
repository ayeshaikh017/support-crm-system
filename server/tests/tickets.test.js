const express = require("express");
const request = require("supertest");

// Replace the Mongoose models with mocks, so the tests never touch a database.
jest.mock("../models/Ticket", () => ({
  create: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
}));

jest.mock("../models/Note", () => ({
  create: jest.fn(),
  find: jest.fn(),
}));

const Ticket = require("../models/Ticket");
const Note = require("../models/Note");
const ticketRoutes = require("../routes/tickets");

const app = express();
app.use(express.json());
app.use("/api", ticketRoutes);

// The routes call .sort() on the result of find(), so the mock must support it.
const sortedResult = (docs) => ({
  sort: jest.fn().mockResolvedValue(docs),
});

const newTicket = {
  customer_name: "Aisha Khan",
  customer_email: "aisha.khan@example.com",
  subject: "Cannot reset my password",
  description: "The reset link returns an expired-token page.",
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe("POST /api/tickets", () => {
  test("creates a ticket and returns its id and creation time", async () => {
    const createdAt = new Date("2026-09-21T09:42:17.312Z");
    Ticket.create.mockImplementation(async (data) => ({
      ...data,
      created_at: createdAt,
    }));

    const res = await request(app).post("/api/tickets").send(newTicket);

    expect(res.status).toBe(201);
    expect(res.body.ticket_id).toMatch(/^TKT-\d+$/);
    expect(res.body.created_at).toBe(createdAt.toISOString());
    expect(Ticket.create).toHaveBeenCalledWith({
      ...newTicket,
      ticket_id: res.body.ticket_id,
    });
  });

  test("returns 400 and saves nothing when a field is missing", async () => {
    const res = await request(app)
      .post("/api/tickets")
      .send({ ...newTicket, subject: undefined });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ message: "All fields are required" });
    expect(Ticket.create).not.toHaveBeenCalled();
  });
});

describe("GET /api/tickets", () => {
  test("filters by status and searches all five fields, newest first", async () => {
    const query = sortedResult([]);
    Ticket.find.mockReturnValue(query);

    const res = await request(app)
      .get("/api/tickets")
      .query({ status: "Open", search: "password" });

    expect(res.status).toBe(200);

    const filter = Ticket.find.mock.calls[0][0];
    expect(filter.status).toBe("Open");
    expect(filter.$or.map((condition) => Object.keys(condition)[0])).toEqual([
      "ticket_id",
      "customer_name",
      "customer_email",
      "subject",
      "description",
    ]);
    expect(query.sort).toHaveBeenCalledWith({ created_at: -1 });
  });

  // Before the fix, "Smith (VIP" crashed the search and ".*" matched every ticket.
  test.each([
    ["Smith (VIP", "Account for Smith (VIP)", "Smith VIP"],
    [".*", "Regex .* in the subject", "Printer is offline"],
  ])(
    "matches %p as plain text",
    async (search, shouldMatch, shouldNotMatch) => {
      Ticket.find.mockReturnValue(sortedResult([]));

      const res = await request(app).get("/api/tickets").query({ search });

      expect(res.status).toBe(200);

      const { $regex, $options } = Ticket.find.mock.calls[0][0].$or[0].ticket_id;
      const pattern = new RegExp($regex, $options);
      expect(pattern.test(shouldMatch)).toBe(true);
      expect(pattern.test(shouldNotMatch)).toBe(false);
    }
  );
});

describe("GET /api/tickets/:ticket_id", () => {
  test("returns the ticket together with its notes", async () => {
    const ticket = { ticket_id: "TKT-001", subject: "Payment failed", status: "Open" };
    const notes = [{ ticket_id: "TKT-001", note_text: "Called the customer" }];
    const notesQuery = sortedResult(notes);
    Ticket.findOne.mockResolvedValue(ticket);
    Note.find.mockReturnValue(notesQuery);

    const res = await request(app).get("/api/tickets/TKT-001");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ticket, notes });
    expect(Note.find).toHaveBeenCalledWith({ ticket_id: "TKT-001" });
    expect(notesQuery.sort).toHaveBeenCalledWith({ created_at: -1 });
  });

  test("returns 404 when the ticket does not exist", async () => {
    Ticket.findOne.mockResolvedValue(null);

    const res = await request(app).get("/api/tickets/TKT-404");

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ message: "Ticket not found" });
    expect(Note.find).not.toHaveBeenCalled();
  });
});

describe("PUT /api/tickets/:ticket_id", () => {
  test("updates the status and appends a note", async () => {
    const savedAt = new Date("2026-09-21T10:05:44.901Z");
    const ticket = {
      ticket_id: "TKT-001",
      status: "Open",
      updated_at: new Date("2026-09-21T09:42:17.312Z"),
      save: jest.fn(async () => {
        ticket.updated_at = savedAt;
      }),
    };
    Ticket.findOne.mockResolvedValue(ticket);
    Note.create.mockResolvedValue({});

    const res = await request(app)
      .put("/api/tickets/TKT-001")
      .send({ status: "Closed", notes: "Refund issued" });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ success: true, updated_at: savedAt.toISOString() });
    expect(ticket.status).toBe("Closed");
    expect(ticket.save).toHaveBeenCalled();
    expect(Note.create).toHaveBeenCalledWith({
      ticket_id: "TKT-001",
      note_text: "Refund issued",
    });
  });
});
