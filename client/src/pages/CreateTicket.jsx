function CreateTicket() {
  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="mb-4">
            <h2>Create Ticket</h2>
            <p className="text-muted">
              Create a new customer support ticket.
            </p>
          </div>

          <div className="card shadow-sm">
            <div className="card-body p-4">
              <form>
                <div className="mb-3">
                  <label htmlFor="customerName" className="form-label">
                    Customer Name
                  </label>

                  <input
                    type="text"
                    id="customerName"
                    className="form-control"
                    placeholder="Enter customer name"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="customerEmail" className="form-label">
                    Customer Email
                  </label>

                  <input
                    type="email"
                    id="customerEmail"
                    className="form-control"
                    placeholder="Enter customer email"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="subject" className="form-label">
                    Issue Title
                  </label>

                  <input
                    type="text"
                    id="subject"
                    className="form-control"
                    placeholder="Enter issue title"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="description" className="form-label">
                    Issue Description
                  </label>

                  <textarea
                    id="description"
                    className="form-control"
                    rows="5"
                    placeholder="Describe the customer's issue"
                  ></textarea>
                </div>

                <div className="d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                  >
                    Cancel
                  </button>

                  <button type="submit" className="btn btn-primary">
                    Create Ticket
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateTicket;