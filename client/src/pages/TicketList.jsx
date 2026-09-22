function TicketList() {
  const tickets = [
    {
      ticket_id: "TKT-001",
      customer_name: "Rahul Sharma",
      subject: "Unable to login",
      status: "Open",
      created_at: "Sep 22, 2026",
    },
    {
      ticket_id: "TKT-002",
      customer_name: "Priya Mehta",
      subject: "Payment failed",
      status: "In Progress",
      created_at: "Sep 22, 2026",
    },
  ];

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Support Tickets</h2>
          <p className="text-muted mb-0">
            Manage and track customer support tickets.
          </p>
        </div>

        <button className="btn btn-primary">
          + Create Ticket
        </button>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <div className="row g-3 mb-4">
            <div className="col-md-8">
              <input
                type="text"
                className="form-control"
                placeholder="Search tickets..."
              />
            </div>

            <div className="col-md-4">
              <select className="form-select">
                <option value="">All Statuses</option>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>

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
                    <td>{ticket.ticket_id}</td>
                    <td>{ticket.customer_name}</td>
                    <td>{ticket.subject}</td>
                    <td>{ticket.status}</td>
                    <td>{ticket.created_at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TicketList;