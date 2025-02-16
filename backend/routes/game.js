import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import Game from "../models/Game.js";

const game = express.Router();

game.post("/start-game", authenticateToken, async (req, res, next) => {
  try {
    const { userId, pairId, gameName } = req.body;

    if (!userId || !pairId || !gameName) {
      return res.status(404).json({ msg: "Invalid information." });
    }

    const currentDate = Date.now();
    const gameId = [...[userId, pairId].sort(), currentDate].join("-");

    res.status(200).json(gameId);
  } catch (error) {
    next(error);
  }
});

export default game;
