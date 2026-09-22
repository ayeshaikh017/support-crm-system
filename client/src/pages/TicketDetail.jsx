import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function TicketDetail() {
  const { ticketId } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [notes, setNotes] = useState([]);
  const [status, setStatus] = useState("");
  const [noteText, setNoteText] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchTicket = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(`/tickets/${ticketId}`);

      setTicket(response.data.ticket);
      setNotes(response.data.notes);
      setStatus(response.data.ticket.status);
    } catch (error) {
      console.error("Fetch ticket error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load ticket."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicket();
  }, [ticketId]);

  const handleUpdate = async (event) => {
    event.preventDefault();

    if (!status && !noteText.trim()) {
      return;
    }

    try {
      setSaving(true);
      setError("");

      await api.put(`/tickets/${ticketId}`, {
        status,
        notes: noteText.trim(),
      });

      setNoteText("");

      await fetchTicket();
    } catch (error) {
      console.error("Update ticket error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to update ticket."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        Loading ticket...
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">
          {error || "Ticket not found."}
        </div>

        <Link to="/" className="btn btn-secondary">
          Back to Tickets
        </Link>
      </div>
    );
  }

  const getStatusBadge = (ticketStatus) => {
  if (ticketStatus === "Open") {
    return "badge bg-primary";
  }

  if (ticketStatus === "In Progress") {
    return "badge bg-warning text-dark";
  }

  if (ticketStatus === "Closed") {
    return "badge bg-success";
  }

  return "badge bg-secondary";
};

  return (
    <div className="container py-4">
      <div className="mb-4">
        <Link to="/" className="text-decoration-none">
          ← Back to Tickets
        </Link>
      </div>

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card shadow-sm mb-4">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-start mb-4">
                <div>
                  <p className="text-muted mb-1">
                    {ticket.ticket_id}
                  </p>

                  <h2 className="mb-1">
                    {ticket.subject}
                  </h2>

                  <p className="text-muted mb-0">
                    Created{" "}
                    {new Date(
                      ticket.created_at
                    ).toLocaleString()}
                  </p>
                </div>

                <span className={getStatusBadge(ticket.status)}>
                        {ticket.status}
                    </span>
              </div>

              <hr />

              <h5>Customer</h5>

              <p className="mb-1">
                <strong>{ticket.customer_name}</strong>
              </p>

              <p className="text-muted">
                {ticket.customer_email}
              </p>

              <h5 className="mt-4">Description</h5>

              <p>{ticket.description}</p>
            </div>
          </div>

          <div className="card shadow-sm">
            <div className="card-body p-4">
              <h5 className="mb-4">Notes</h5>

              {notes.length === 0 ? (
                <p className="text-muted">
                  No notes added yet.
                </p>
              ) : (
                notes.map((note) => (
                  <div
                    key={note._id}
                    className="border rounded p-3 mb-3"
                  >
                    <p className="mb-2">
                      {note.note_text}
                    </p>

                    <small className="text-muted">
                      {new Date(
                        note.created_at
                      ).toLocaleString()}
                    </small>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <h5 className="mb-4">Update Ticket</h5>

              <form onSubmit={handleUpdate}>
                <div className="mb-3">
                  <label
                    htmlFor="status"
                    className="form-label"
                  >
                    Status
                  </label>

                  <select
                    id="status"
                    className="form-select"
                    value={status}
                    onChange={(event) =>
                      setStatus(event.target.value)
                    }
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">
                      In Progress
                    </option>
                    <option value="Closed">
                      Closed
                    </option>
                  </select>
                </div>

                <div className="mb-3">
                  <label
                    htmlFor="note"
                    className="form-label"
                  >
                    Add a note
                  </label>

                  <textarea
                    id="note"
                    className="form-control"
                    rows="5"
                    placeholder="Write a note..."
                    value={noteText}
                    onChange={(event) =>
                      setNoteText(event.target.value)
                    }
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={saving}
                >
                  {saving ? "Updating..." : "Update Ticket"}
                </button>
              </form>
            </div>
          </div>

          <button
            type="button"
            className="btn btn-outline-secondary w-100 mt-3"
            onClick={() => navigate("/")}
          >
            Back to Tickets
          </button>
        </div>
      </div>
    </div>
  );
}

export default TicketDetail;