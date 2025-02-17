import express from "express";
import { authenticateToken } from "../../middleware/auth.js";
import quiz from "./quiz.js";

const games = express.Router();

games.use("/quiz", quiz);

games.get("/:userId", authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;

    const testGame = {
      gameId: "dsadsda",
      gameName: "Quiz",
      players: ["1", userId],
      status: "waiting",
      createdAt: 2313219921,
    };

    res.json(testGame);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default games;
