import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<h1 className="text-center mt-5">Support CRM Home</h1>}
      />

      <Route
        path="/create-ticket"
        element={<h1 className="text-center mt-5">Create Ticket</h1>}
      />

      <Route
        path="/tickets/:ticketId"
        element={<h1 className="text-center mt-5">Ticket Details</h1>}
      />
    </Routes>
  );
}

export default App;