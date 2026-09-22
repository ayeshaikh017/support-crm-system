import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import TicketList from "./pages/TicketList";
import CreateTicket from "./pages/CreateTicket";
import TicketDetail from "./pages/TicketDetail";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<TicketList />} />

        <Route
          path="/create-ticket"
          element={<CreateTicket />}
        />

        <Route
          path="/tickets/:ticketId"
          element={<TicketDetail />}
        />
      </Routes>
    </>
  );
}

export default App;