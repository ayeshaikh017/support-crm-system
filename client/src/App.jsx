import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import TicketList from "./pages/TicketList";
import CreateTicket from "./pages/CreateTicket";
function App() {
  return (
    <>
    <Navbar />
    <Routes>
      <Route
        path="/"
        element={<TicketList />}
      />

      <Route
        path="/create-ticket"
        element={<CreateTicket />}
      />

      <Route
        path="/tickets/:ticketId"
        element={<h1 className="text-center mt-5">Ticket Details</h1>}
      />
    </Routes>
    </>
    
  );
}

export default App;