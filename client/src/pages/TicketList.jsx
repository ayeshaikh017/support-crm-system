import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function TicketList() {
  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTickets = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/tickets", {
        params: {
          search,
          status,
        },
      });

      setTickets(response.data);
    } catch (error) {
      console.error("Fetch tickets error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load tickets."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [search, status]);

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Support Tickets</h2>
          <p className="text-muted mb-0">
            Manage and track customer support tickets.
          </p>
        </div>

        <Link
          to="/create-ticket"
          className="btn btn-primary"
        >
          + Create Ticket
        </Link>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <div className="row g-3 mb-4">
            <div className="col-md-8">
              <input
                type="text"
                className="form-control"
                placeholder="Search by ID, name, email, subject or description..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>

            <div className="col-md-4">
              <select
                className="form-select"
                value={status}
                onChange={(event) => setStatus(event.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="alert alert-danger">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-4">
              Loading tickets...
            </div>
          ) : tickets.length === 0 ? (
            <div className="text-center text-muted py-4">
              No tickets found.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Ticket ID</th>
                    <th>Customer</th>
                    <th>Issue</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>

                <tbody>
                  {tickets.map((ticket) => (
                    <tr key={ticket.ticket_id}>
                      <td>
                        <Link
                          to={`/tickets/${ticket.ticket_id}`}
                          className="fw-semibold"
                        >
                          {ticket.ticket_id}
                        </Link>
                      </td>

                      <td>
                        <div>{ticket.customer_name}</div>
                        <small className="text-muted">
                          {ticket.customer_email}
                        </small>
                      </td>

                      <td>{ticket.subject}</td>

                      <td>
                        <span className="badge bg-secondary">
                          {ticket.status}
                        </span>
                      </td>

                      <td>
                        {new Date(
                          ticket.created_at
                        ).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TicketList;