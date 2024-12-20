import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  chatId: {
    type: String,
    ref: "Chat",
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
    required: false,
  },
  isRead: {
    type: Boolean,
    default: false,
    required: false,
  },
  readAt: {
    type: Date,
    default: null,
    required: false,
  },
  isDeleted: {
    type: Boolean,
    default: false,
    required: false,
  },
});

const Message = mongoose.model("Message", messageSchema);

export default Message;
