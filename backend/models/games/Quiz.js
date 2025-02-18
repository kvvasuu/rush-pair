import mongoose from "mongoose";

const quizSchema = new mongoose.Schema({
  gameId: {
    type: String,
    required: true,
    unique: true,
  },
  questions: [
    {
      questionId: { type: mongoose.Schema.Types.ObjectId, ref: "QuizQuestion" },
      answers: { player1: { type: String }, player2: { type: String } },
    },
  ],
  matchScore: {
    type: Number,
    default: 0,
  },
});

const Quiz = mongoose.model("Quiz", quizSchema);

export default Quiz;
