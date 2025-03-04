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
    const { playerId } = req.query;

    const game = await Game.findOne({ gameId });
    const quiz = await Quiz.findOne({ gameId });

    if (!quiz) {
      return res.status(404).json({ msg: "quizNotFound" });
    }

    const questions = [...quiz.questions].map((question) => {
      const answers = question.answers.filter(
        (answer) => answer.player === playerId
      );
      return {
        question: question.question,
        options: question.options,
        answers,
      };
    });

    const data = {
      gameId: gameId,
      players: game.players,
      status: game.status,
      createdAt: game.createdAt,
      createdBy: game.createdBy,
      gameData: { questions },
      score: quiz.matchScore,
    };

    res.json(data);
  } catch (error) {
    next(error);
  }
});

quiz.patch("/answer", authenticateToken, async (req, res, next) => {
  try {
    const { question, answer, playerId, gameId } = req.body;

    const quizData = await Quiz.findOne({
      gameId: gameId,
      "questions.question": question,
    });

    if (!quizData) {
      return res.status(404).json({ msg: "quizNotFound" });
    }

    const quizQuestion = quizData.questions.find(
      (q) => q.question === question
    );

    if (!quizQuestion) {
      return res.status(404).json({ msg: "questionNotFound" });
    }

    const existingAnswer = quizQuestion.answers.find(
      (a) => a.player === playerId
    );

    if (existingAnswer) {
      return res.status(400).json({ msg: "alreadyAnswered" });
    }

    const updatedQuiz = await Quiz.findOneAndUpdate(
      { gameId: gameId, "questions.question": question },
      {
        $push: { "questions.$.answers": { player: playerId, answer: answer } },
      },
      { new: true, runValidators: true }
    ).select("questions.question questions.answers");

    const updatedQuestion = updatedQuiz.questions
      .find((q) => q.question === question)
      .answers.filter((ans) => ans.player === playerId);

    res.json({
      answer: updatedQuestion[0].answer,
    });
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
