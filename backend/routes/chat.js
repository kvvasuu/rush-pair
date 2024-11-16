import express from "express";
import { authenticateToken } from "./auth.js";
import User from "../models/User.js";
import Pair from "../models/Pair.js";
import calculateYearsSince from "../utils.js";

const chat = express.Router();

chat.get("/get-pairs/", authenticateToken, async (req, res) => {
  try {
    const pairs = await Pair.findOne({ email: req.user.user.email });

    if (!pairs) {
      return res.json({ pairedWith: [] });
    }

    const pairedWith = await Promise.all(
      pairs.pairedWith.map(async (el) => {
        const pairedUser = await User.findById(el.id);
        if (!pairedUser) return null;

        return el.isVisible
          ? {
              id: pairedUser.id,
              pairedAt: el.pairedAt,
              name: el.name || pairedUser.name,
              imageUrl: pairedUser.imageUrl,
              isVisible: true,
            }
          : {
              id: pairedUser.id,
              pairedAt: el.pairedAt,
              isVisible: false,
              name: el.name,
            };
      })
    );

    const data = pairedWith.filter((el) => el !== null);
    res.json({ pairedWith: data });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});

chat.get("/get-pair-chat/:id", authenticateToken, async (req, res) => {
  try {
    const pairChatUser = await User.findById(req.params.id);

    if (!pairChatUser) {
      return res.json({ pairChatUser: [] });
    }
    const pairs = await Pair.findOne({ email: req.user.user.email });
    const pair = pairs.pairedWith.find((pair) => pair.id === req.params.id);

    const age = calculateYearsSince(pairChatUser.birthdate);

    const data = pair.isVisible
      ? {
          id: pairChatUser.id,
          name: pair.name || pairChatUser.name,
          imageUrl: pairChatUser.imageUrl,
          age: age,
          isVisible: true,
          city: pairChatUser.city,
          gender: pairChatUser.gender,
          description: pairChatUser.description,
        }
      : {
          id: pairChatUser.id,
          isVisible: false,
          name: pair.name,
        };

    res.json({ pairChatUser: data });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});

chat.put("/change-pair-nickname/:id", authenticateToken, async (req, res) => {
  try {
    if (!req.body.nickname || req.body?.nickname.length <= 0) {
      return res.status(404).json({ msg: "No nickname provided." });
    }

    const nickname = req.body.nickname.trim();

    const result = await Pair.findOneAndUpdate(
      { email: req.user.user.email, "pairedWith.id": req.params.id },
      { $set: { "pairedWith.$.name": nickname } },
      { new: true, runValidators: true }
    );

    if (!result) {
      return res.status(404).json({ msg: "Cannot change name." });
    }
    res.status(200).json({ msg: "Nickname changed" });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});

export default chat;
