import mongoose from "mongoose";

const activeUserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  isAvailable: {
    type: Boolean,
    required: true,
  },
});

const ActiveUser = mongoose.model("ActiveUser", activeUserSchema);

export default ActiveUser;
