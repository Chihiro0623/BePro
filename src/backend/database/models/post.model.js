const { Schema, model, SchemaType } = require("mongoose");

const post = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  posttype: {
    type: Number,
    required: true,
    default: 0,
  },
  projectpage: {
    type: Schema.Types.ObjectId,
    ref: "posts",
  },
  fileid: {
    type: Schema.Types.ObjectId,
    ref: "files",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  likes: {
    type: Number,
    default: 0,
  },
  comments: {
    type: Array,
    default: [],
    ref: "comments",
  },
  participants: {
    type: Array,
    default: [],
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

module.exports = model("posts", post);
