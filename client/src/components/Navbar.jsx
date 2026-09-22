import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg bg-white border-bottom">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          Support CRM
        </Link>

        <div className="ms-auto">
          <Link className="btn btn-outline-primary me-2" to="/">
            Tickets
          </Link>

          <Link className="btn btn-primary" to="/create-ticket">
            Create Ticket
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;