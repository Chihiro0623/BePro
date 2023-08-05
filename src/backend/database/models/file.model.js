const { Schema, model } = require("mongoose");

const file = new Schema({
  originalname: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = model("files", file);
