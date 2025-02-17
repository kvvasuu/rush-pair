import mongoose from "mongoose";

const quizSchema = new mongoose.Schema({
  gameId: {
    type: String,
    required: true,
    unique: true,
  },
  players: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  ],
  createdAt: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["waiting", "inProgress", "finished"],
    default: "waiting",
  },
});

const Quiz = mongoose.model("Quiz", quizSchema);

export default Quiz;
