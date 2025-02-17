import express from "express";
import { authenticateToken } from "../../middleware/auth.js";
import Quiz from "../../models/games/Quiz.js";

const quiz = express.Router();

quiz.post("/start", authenticateToken, async (req, res, next) => {
  try {
    const { userId, pairId, gameName } = req.body;

    if (!userId || !pairId || !gameName) {
      return res.status(404).json({ msg: "Invalid information." });
    }

    const gameId = [...[userId, pairId].sort(), Date.now()].join("-");

    res.status(200).json(gameId);
  } catch (error) {
    next(error);
  }
});

quiz.get("/:gameId", authenticateToken, async (req, res) => {
  try {
    const { gameId } = req.params;
    const { userId } = req.query;

    /* const game = await Quiz.findById(gameId);
    if (!game) return res.status(404).json({ msg: "gameNotFound" });

    if (userId && !game.players.includes(userId)) {
      return res
        .status(403)
        .json({ error: "You are not a player in this game" });
    } */

    res.json("gameData :D");
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default quiz;
