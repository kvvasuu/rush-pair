import express from "express";
import * as fs from "node:fs/promises";
import path from "path";
import mongoose from "mongoose";
import { authenticateToken } from "../middleware/auth.js";
import User from "../models/User.js";
import Pair from "../models/Pair.js";
import ActiveUser from "../models/ActiveUser.js";
import Report from "../models/Report.js";
import Message from "../models/Message.js";
import { calculateYearsSince, sendEmail, rateLimiter } from "../utils.js";
import { __dirname } from "../app.js";
import { getIO } from "../sockets/socketManager.js";

const chat = express.Router();

chat.get("/get-pairs/", authenticateToken, async (req, res, next) => {
  try {
    const pairs = await Pair.findOne({ email: req.user.user.email });

    if (!pairs) {
      return res.json({ pairedWith: [] });
    }

    const pairedWith = await Promise.all(
      pairs.pairedWith.map(async (el) => {
        const pairedUser = await User.findById(el.id);
        const isActive = await ActiveUser.exists({ userId: el.id });

        if (!pairedUser) return null;

        return el.isVisible
          ? {
              id: pairedUser.id,
              pairedAt: el.pairedAt,
              name: el.name || pairedUser.name,
              imageUrl: pairedUser.imageUrl,
              isVisible: true,
              isActive: !!isActive,
              askedForReveal: el.askedForReveal,
              unreadMessagesCount: el.unreadMessagesCount,
            }
          : {
              id: pairedUser.id,
              pairedAt: el.pairedAt,
              isVisible: false,
              name: el.name || "Anonymous",
              isActive: !!isActive,
              askedForReveal: el.askedForReveal,
              unreadMessagesCount: el.unreadMessagesCount,
            };
      })
    );

    const data = pairedWith
      .filter((el) => el !== null)
      .sort((a, b) => b.pairedAt - a.pairedAt);
    res.json({ pairedWith: data });
  } catch (error) {
    next(error);
  }
});

chat.get("/get-pair-chat/:id", authenticateToken, async (req, res, next) => {
  try {
    const pairChatUser = await User.findById(req.params.id);

    if (!pairChatUser) {
      return res.json({ pairChatUser: [] });
    }
    const pairs = await Pair.findOne({ email: req.user.user.email });
    const pair = pairs.pairedWith.find((pair) => pair.id === req.params.id);

    const isActive = await ActiveUser.exists({ userId: req.params.id });

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
          isActive: !!isActive,
          askedForReveal: pair.askedForReveal || false,
          hasBeenAskedForReveal: pair.hasBeenAskedForReveal || false,
        }
      : {
          id: pairChatUser.id,
          isVisible: false,
          name: pair.name || "Anonymous",
          isActive: !!isActive,
          askedForReveal: pair.askedForReveal || false,
          hasBeenAskedForReveal: pair.hasBeenAskedForReveal || false,
        };

    res.json({ pairChatUser: data });
  } catch (error) {
    next(error);
  }
});

chat.put(
  "/change-pair-nickname/:id",
  rateLimiter,
  authenticateToken,
  async (req, res, next) => {
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
      next(error);
    }
  }
);

chat.get("/get-messages/:chatId", authenticateToken, async (req, res, next) => {
  const { chatId } = req.params;
  const { page = 1, limit = 50 } = req.query;

  try {
    const messages = await Message.find({ chatId })
      .select("sender content date isRead readAt isDeleted date")
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const modifiedMessages = [...messages].map((message) => {
      return !message.isDeleted
        ? message
        : {
            _id: message._id,
            sender: message.sender,
            date: message.date,
            isDeleted: message.isDeleted,
          };
    });

    res.json(modifiedMessages);
  } catch (error) {
    next(error);
  }
});

chat.post("/report-user", authenticateToken, async (req, res, next) => {
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
    next(error);
  }
});

chat.post("/ask-for-reveal", authenticateToken, async (req, res, next) => {
  try {
    const { userId, pairId } = req.body;

    if (
      !userId ||
      !pairId ||
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(pairId)
    ) {
      throw new Error("Invalid IDs");
    }

    const io = getIO();

    const user = await User.findOne({ _id: userId });

    if (!user || user.rushCoins < 2) {
      return res.status(422).json({ msg: "notEnoughRushCoins" });
    }

    const pairEmail = await User.findOne({ _id: pairId }).select("email");

    const pair = await Pair.findOneAndUpdate(
      { email: user.email, "pairedWith.id": pairId },
      {
        $set: { "pairedWith.$.hasBeenAskedForReveal": true },
      },
      { new: true }
    );

    if (!pair) {
      throw new Error("Pair not found");
    }

    const userUpdated = await Pair.findOneAndUpdate(
      { email: pairEmail.email, "pairedWith.id": userId },
      {
        $set: { "pairedWith.$.askedForReveal": true },
      },
      { new: true }
    );

    if (!userUpdated) {
      throw new Error("User not found");
    }

    const userSocketId = await ActiveUser.findOne({ userId: userId });
    const pairSocketId = await ActiveUser.findOne({ userId: pairId });

    console.log(userSocketId, pairSocketId);

    const userPair = userUpdated.pairedWith.find((p) => p.id === userId);
    const pairPair = pair.pairedWith.find((p) => p.id === pairId);

    if (
      (userPair?.askedForReveal && pairPair?.askedForReveal) ||
      (userPair?.hasBeenAskedForReveal && pairPair?.hasBeenAskedForReveal)
    ) {
      await Pair.updateOne(
        { email: pairEmail.email, "pairedWith.id": userId },
        {
          $unset: {
            "pairedWith.$.askedForReveal": "",
            "pairedWith.$.hasBeenAskedForReveal": "",
            "pairedWith.$.name": "",
          },
          $set: { "pairedWith.$.isVisible": true },
        }
      );

      await Pair.updateOne(
        { email: user.email, "pairedWith.id": pairId },
        {
          $unset: {
            "pairedWith.$.askedForReveal": "",
            "pairedWith.$.hasBeenAskedForReveal": "",
            "pairedWith.$.name": "",
          },
          $set: { "pairedWith.$.isVisible": true },
        }
      );

      if (userSocketId && pairSocketId) {
        io.to(userSocketId.socketId).emit("setPairVisible");
        io.to(pairSocketId.socketId).emit("setPairVisible");
      }
    } else {
      if (pairSocketId) {
        io.to(pairSocketId.socketId).emit("askedForReveal");
      }
    }

    await User.updateOne(
      { _id: userId },
      {
        $inc: { rushCoins: -2 },
      }
    );
    return res.status(201).json({ hasBeenAskedForReveal: true });
  } catch (error) {
    next(error);
  }
});

chat.patch(
  "/delete-message/:messageId",
  authenticateToken,
  async (req, res, next) => {
    const { messageId } = req.params;

    try {
      const message = await Message.findOneAndUpdate(
        { _id: messageId, sender: req.body.sender },
        { $set: { isDeleted: true } },
        { new: true }
      );

      res.json(message);
    } catch (error) {
      next(error);
    }
  }
);

export default chat;
