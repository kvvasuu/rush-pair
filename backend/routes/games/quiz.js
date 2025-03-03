import express from "express";
import { authenticateToken } from "../../middleware/auth.js";
import Quiz from "../../models/games/Quiz.js";
import Game from "../../models/games/Game.js";
import QuizQuestion from "../../models/games/QuizQuestion.js";

const quiz = express.Router();

quiz.post("/", authenticateToken, async (req, res, next) => {
  try {
    const { gameId } = req.body;

    const questions = await QuizQuestion.aggregate([
      { $sample: { size: 5 } },
      { $project: { _id: 0, question: 1, options: 1 } },
    ]);

    const newQuiz = new Quiz({
      gameId,
      questions: questions,
    });

    await newQuiz.save();
    res.status(201).json(newQuiz);
  } catch (error) {
    next(error);
  }
});

quiz.get("/:gameId", authenticateToken, async (req, res, next) => {
  try {
    const { gameId } = req.params;
    const game = await Game.findOne({ gameId });
    const quiz = await Quiz.findOne({ gameId });

    if (!quiz) {
      return res.status(404).json({ msg: "quizNotFound" });
    }

    const data = {
      gameId: gameId,
      players: game.players,
      status: game.status,
      createdAt: game.createdAt,
      gameData: { questions: quiz.questions },
      score: quiz.matchScore,
    };

    res.json(data);
  } catch (error) {
    next(error);
  }
});

const calculateMatch = (player1Answer, player2Answer, question) => {
  if (player1Answer === player2Answer) {
    return 100;
  }
  if (question.compatibility.get(player1Answer)?.includes(player2Answer)) {
    return 50;
  }
  return 0;
};

const calculateTotalMatch = (quizGame) => {
  const totalQuestions = quizGame.questions.length;
  const totalScore = quizGame.questions.reduce(
    (sum, q) => sum + q.matchPercentage,
    0
  );
  return Math.round(totalScore / totalQuestions);
};

export default quiz;
