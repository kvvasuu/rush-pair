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

    const games = await Game.find({ "players.player": userId }).select(
      "-_id gameId players gameName createdAt createdBy"
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
    });

    if (activeGame) {
      return res.status(400).json({ message: "Game already exists" });
    }

    const currentDate = Date.now();

    const gameId = [...[userId, pairId].sort(), currentDate].join("-");

    const newGame = new Game({
      gameId,
      gameName,
      players: [
        { player: userId, status: "pending" },
        { player: pairId, status: "pending" },
      ],
      createdAt: currentDate,
      createdBy: userId,
    });

    await newGame.save();

    res.status(201).json(gameId);
  } catch (error) {
    next(error);
  }
});

games.patch("/start", authenticateToken, async (req, res, next) => {
  try {
    const { userId, gameId } = req.body;

    if (!userId || !gameId) {
      return res.status(404).json({ msg: "Invalid information." });
    }

    const game = await Game.findOneAndUpdate(
      { gameId: gameId, "players.player": userId },
      { $set: { "players.$.status": "inProgress" } },
      { new: true, runValidators: true }
    );

    if (!game) {
      return res.status(404).json({ msg: "Game not found." });
    }

    res.status(201).json(game);
  } catch (error) {
    next(error);
  }
});

export default games;
