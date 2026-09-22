const express = require("express");
const Ticket = require("../models/Ticket");

const router = express.Router();

router.post("/tickets", async (req, res) => {
  try {
    const {
      customer_name,
      customer_email,
      subject,
      description,
    } = req.body;

    if (
      !customer_name ||
      !customer_email ||
      !subject ||
      !description
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const ticketCount = await Ticket.countDocuments();

    const ticket_id = `TKT-${String(ticketCount + 1).padStart(3, "0")}`;

    const ticket = await Ticket.create({
      ticket_id,
      customer_name,
      customer_email,
      subject,
      description,
    });

    res.status(201).json({
      ticket_id: ticket.ticket_id,
      created_at: ticket.created_at,
    });
  } catch (error) {
    console.error("Create ticket error:", error);

    res.status(500).json({
      message: "Failed to create ticket",
    });
  }
});

module.exports = router;