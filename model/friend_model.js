const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const friendSchema = new Schema({
  userId: {
    type: String,
    required: true,
    unique: false
  },
  friendId: {
    type: String,
    required: true,
  },
  isFriend: {
    type: Boolean,
    required: true,
    default: false,
  },
  isFriendRequestSent: {
    type: Boolean,
    required: true,
    default: false,
  },
  isFriendRequestRecieved: {
    type: Boolean,
    required: true,
    default: false,
  },
  userName:{
    type : String,
    required: true,
  },
  friendName:{
    type : String,
    required: true,
  }
  
});

module.exports = mongoose.model("friend", friendSchema);
