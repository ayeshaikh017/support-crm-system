import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function CreateTicket() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    customer_name: "",
    customer_email: "",
    subject: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await api.post("/tickets", formData);

      console.log("Ticket created:", response.data);

      navigate("/");
    } catch (error) {
      console.error("Create ticket error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to create ticket. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

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
              {error && (
                <div className="alert alert-danger">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label
                    htmlFor="customer_name"
                    className="form-label"
                  >
                    Customer Name
                  </label>

                  <input
                    type="text"
                    id="customer_name"
                    name="customer_name"
                    className="form-control"
                    placeholder="Enter customer name"
                    value={formData.customer_name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label
                    htmlFor="customer_email"
                    className="form-label"
                  >
                    Customer Email
                  </label>

                  <input
                    type="email"
                    id="customer_email"
                    name="customer_email"
                    className="form-control"
                    placeholder="Enter customer email"
                    value={formData.customer_email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label
                    htmlFor="subject"
                    className="form-label"
                  >
                    Issue Title
                  </label>

                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    className="form-control"
                    placeholder="Enter issue title"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="description"
                    className="form-label"
                  >
                    Issue Description
                  </label>

                  <textarea
                    id="description"
                    name="description"
                    className="form-control"
                    rows="5"
                    placeholder="Describe the customer's issue"
                    value={formData.description}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>

                <div className="d-flex justify-content-end">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? "Creating..." : "Create Ticket"}
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