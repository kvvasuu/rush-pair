import mongoose from "mongoose";

const pairSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    ref: "User",
  },
  pairedWith: [
    {
      id: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: false,
      },
      pairedAt: {
        type: Number,
        default: () => Math.floor(Date.now() / 1000),
      },
      isVisible: {
        type: Boolean,
        default: false,
      },
      askedForReveal: {
        type: Boolean,
        default: false,
      },
      hasBeenAskedForReveal: {
        type: Boolean,
        default: false,
      },
      unreadMessagesCount: {
        type: Number,
      },
      isBlocked: {
        type: Boolean,
        required: false,
      },
      isFavourite: {
        type: Boolean,
        default: false,
      },
    },
  ],
});

const Pair = mongoose.model("Pair", pairSchema);

export default Pair;
