const { Schema, model } = require("mongoose");

const comment = new Schema({
  description: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  likes: {
    type: Number,
    default: 0,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
  writer: {
    type: String,
    required: true,
  },
});

module.exports = model("comments", comment);
