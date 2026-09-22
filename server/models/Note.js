const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    ticket_id: {
      type: String,
      required: true,
    },

    note_text: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: false,
    },
  }
);

module.exports = mongoose.model("Note", noteSchema);