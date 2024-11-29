import mongoose from "mongoose";

const activeUserSchema = new mongoose.Schema({
  socketId: {
    type: String,
    required: true,
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  isAvailable: {
    type: Boolean,
    required: true,
  },
});

const ActiveUser = mongoose.model("ActiveUser", activeUserSchema);

export default ActiveUser;
