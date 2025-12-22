import mongoose from "mongoose";

const gameSchema = new mongoose.Schema({
  gameId: {
    type: String,
    required: true,
    unique: true,
  },
  players: [
    {
      player: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      status: {
        type: String,
        enum: ["pending", "inProgress", "finished"],
        default: "pending",
      },
    },
  ],
  gameName: { type: String, required: true },
  createdAt: { type: Date },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Game = mongoose.model("Game", gameSchema);

export default Game;
