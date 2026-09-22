const express = require("express");
const Ticket = require("../models/Ticket");
const Note = require("../models/Note");

const router = express.Router();

router.post("/tickets", async (req, res) => {
  try {
    const {
      customer_name,
      customer_email,
      subject,
      description,
    } = req.body;

    if (
      !customer_name ||
      !customer_email ||
      !subject ||
      !description
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const ticketCount = await Ticket.countDocuments();

    const ticket_id = `TKT-${Date.now()}`;

    const ticket = await Ticket.create({
      ticket_id,
      customer_name,
      customer_email,
      subject,
      description,
    });

    res.status(201).json({
      ticket_id: ticket.ticket_id,
      created_at: ticket.created_at,
    });
  } catch (error) {
    console.error("Create ticket error:", error);

    res.status(500).json({
      message: "Failed to create ticket",
    });
  }
});

router.get("/tickets", async (req, res) => {
  try {
    const { status, search } = req.query;

    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        { ticket_id: { $regex: search, $options: "i" } },
        { customer_name: { $regex: search, $options: "i" } },
        { customer_email: { $regex: search, $options: "i" } },
        { subject: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const tickets = await Ticket.find(filter).sort({
      created_at: -1,
    });

    res.json(tickets);
  } catch (error) {
    console.error("Get tickets error:", error);

    res.status(500).json({
      message: "Failed to fetch tickets",
    });
  }
});
router.get("/tickets/:ticket_id", async (req, res) => {
  try {
    const { ticket_id } = req.params;

    const ticket = await Ticket.findOne({ ticket_id });

    if (!ticket) {
      return res.status(404).json({
        message: "Ticket not found",
      });
    }

    const notes = await Note.find({ ticket_id }).sort({
      created_at: -1,
    });

    res.json({
      ticket,
      notes,
    });
  } catch (error) {
    console.error("Get ticket details error:", error);

    res.status(500).json({
      message: "Failed to fetch ticket details",
    });
  }
});
router.put("/tickets/:ticket_id", async (req, res) => {
  try {
    const { ticket_id } = req.params;
    const { status, notes } = req.body;

    const ticket = await Ticket.findOne({ ticket_id });

    if (!ticket) {
      return res.status(404).json({
        message: "Ticket not found",
      });
    }

    if (status) {
      ticket.status = status;
      await ticket.save();
    }

    if (notes) {
      await Note.create({
        ticket_id,
        note_text: notes,
      });
    }

    res.json({
      success: true,
      updated_at: ticket.updated_at,
    });
  } catch (error) {
    console.error("Update ticket error:", error);

    res.status(500).json({
      message: "Failed to update ticket",
    });
  }
});
module.exports = router;