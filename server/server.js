require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const ticketRoutes = require("./routes/tickets");
const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/api", ticketRoutes);

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});
connectDB();
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});