const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

const groupSchema = new Schema({
  message: {
    type: String,
  },
  userId: {
    type: String,
    required: true,
  },
  groupId: {
    type: String,
    required: true,
  },
  senderName: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  src_path: {
    type: String,
  },
  dest_path: {
    type: String,
  },
});

module.exports = mongoose.model("group", groupSchema);
