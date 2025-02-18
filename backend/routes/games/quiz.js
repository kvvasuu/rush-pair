import express from "express";
import { authenticateToken } from "../../middleware/auth.js";
import Quiz from "../../models/games/Quiz.js";
import Game from "../../models/games/Game.js";

const quiz = express.Router();

quiz.post("/", authenticateToken, async (req, res, next) => {
  try {
    const { gameId } = req.body;

    /* const questions = await getRandomQuestions(); // Funkcja do losowania pytań */

    const newQuiz = new Quiz({
      gameId,
      questions: [],
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
      gameData: quiz.questions,
      score: quiz.matchScore,
    };

    res.json(data);
  } catch (error) {
    next(error);
  }
});

const getRandomQuestions = () => {};

export default quiz;
