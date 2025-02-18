import mongoose from "mongoose";

const gameSchema = new mongoose.Schema({
  gameId: {
    type: String,
    required: true,
    unique: true,
  },
  players: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  ],
  gameName: { type: String, required: true },
  createdAt: { type: Date },
  status: {
    type: String,
    enum: ["pending", "inProgress", "finished"],
    default: "pending",
  },
});

const Game = mongoose.model("Game", gameSchema);

export default Game;
