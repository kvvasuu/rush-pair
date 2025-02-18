import express from "express";
import { authenticateToken } from "../../middleware/auth.js";
import quiz from "./quiz.js";
import Game from "../../models/games/Game.js";

const games = express.Router();

games.use("/quiz", quiz);

games.get("/:userId", authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(404).json({ msg: "Invalid information." });
    }

    const games = await Game.find({ players: { $in: [userId] } }).select(
      "-_id gameId players gameName createdAt status"
    );
    res.json(games);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

games.post("/", authenticateToken, async (req, res, next) => {
  try {
    const { userId, pairId, gameName } = req.body;

    if (!userId || !pairId || !gameName) {
      return res.status(404).json({ msg: "Invalid information." });
    }
    const regexPattern = new RegExp(`^${[userId, pairId].sort().join("-")}-`);

    const activeGame = await Game.findOne({
      gameId: { $regex: regexPattern },
      status: { $ne: "finished" },
    });

    if (activeGame) {
      return res.status(400).json({ message: "Game already exists" });
    }

    const currentDate = Date.now();

    const gameId = [...[userId, pairId].sort(), currentDate].join("-");

    const newGame = new Game({
      gameId,
      gameName,
      players: [userId, pairId],
      createdAt: currentDate,
    });

    await newGame.save();

    res.status(201).json(gameId);
  } catch (error) {
    next(error);
  }
});

export default games;
