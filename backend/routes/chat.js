import express from "express";
import * as fs from "node:fs/promises";
import path from "path";
import { authenticateToken } from "./auth.js";
import User from "../models/User.js";
import Pair from "../models/Pair.js";
import Report from "../models/Report.js";
import { calculateYearsSince, sendEmail, rateLimiter } from "../utils.js";
import { __dirname } from "../app.js";

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
              name: el.name || "Anonymous",
            };
      })
    );

    const data = pairedWith
      .filter((el) => el !== null)
      .sort((a, b) => b.pairedAt - a.pairedAt);
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
          name: pair.name || "Anonymous",
        };

    res.json({ pairChatUser: data });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});

chat.put(
  "/change-pair-nickname/:id",
  rateLimiter,
  authenticateToken,
  async (req, res) => {
    try {
      if (!req.body.nickname || req.body?.nickname.length <= 0) {
        return res.status(404).json({ msg: "No nickname provided." });
      }

      const nickname = req.body.nickname.trim();

      if (nickname.length > 50) {
        return res.status(400).json({ msg: "Nickname is too long." });
      }

      const result = await Pair.findOneAndUpdate(
        { email: req.user.user.email, "pairedWith.id": req.params.id },
        { $set: { "pairedWith.$.name": nickname } },
        { new: true, runValidators: true }
      );

      if (!result) {
        return res.status(404).json({ msg: "Cannot change name." });
      }
      res.status(200).json({ msg: "Nickname changed", nickname: nickname });
    } catch (error) {
      res.status(500).json({ msg: "Server error" });
    }
  }
);

chat.post("/report-user", authenticateToken, async (req, res) => {
  try {
    if (!req.body.reportType || !req.body.confirmed || !req.body.userId) {
      return res.status(404).json({ msg: "Invalid information." });
    }

    const message = req.body.message.trim();
    const reportedBy = req.user.user.email;

    const { userId, reportType } = req.body;

    const report = new Report({
      userId: userId,
      reportedBy: reportedBy,
      type: reportType,
      message: message,
    });

    const htmlTemplate = await fs.readFile(
      path.join(__dirname, "email_templates/report.html"),
      "utf-8"
    );

    return await report.save().then((report) => {
      const html = htmlTemplate.replace(
        "{{reportIdToReplace}}",
        report.referenceId
      );

      sendEmail({
        from: "RushPair Support Team <support@rushpair.com>",
        to: reportedBy,
        subject: `Report ID: ${report.referenceId}`,
        html: html,
      });

      return res
        .status(201)
        .json({ msg: "Report sent.", reportReferenceId: report.referenceId });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server error" });
  }
});

export default chat;
