import mongoose from "mongoose";

const pairSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  pairedWith: [
    {
      email: {
        type: String,
        required: true,
        unique: true,
      },
      pairedAt: {
        type: Number,
        default: () => Date.now(),
      },
      isVisible: {
        type: Boolean,
        default: false,
      },
    },
  ],
});

const Pair = mongoose.model("Pair", pairSchema);

export default Pair;
