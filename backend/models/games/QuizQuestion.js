import mongoose from "mongoose";

const QuizQuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: { type: [String], required: true },
  compatibility: {
    type: Map,
    of: [String],
    required: true,
  },
});

const QuizQuestion = mongoose.model("QuizQuestion", QuizQuestionSchema);

export default QuizQuestion;
