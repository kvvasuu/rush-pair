import mongoose from "mongoose";

const pairSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  pairedWith: [
    {
      id: {
        type: String,
        required: true,
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
