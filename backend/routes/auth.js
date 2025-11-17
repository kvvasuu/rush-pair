import express from "express";
import { check, validationResult } from "express-validator";
import * as fs from "node:fs/promises";
import path from "path";
import { __dirname } from "../app.js";
import bcrypt from "bcryptjs";
import { sendEmail, rateLimiter } from "../utils.js";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

const auth = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;
const EMAIL_SECRET = process.env.EMAIL_SECRET;

auth.post(
  "/register",
  [
    check("email", "emailNotCorrect").isEmail(),
    check("password", "passwordTooShort").isLength({
      min: 6,
    }),
  ],
  rateLimiter,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const firstVisit = true;

    try {
      let user = await User.findOne({ email });
      if (user) {
        return res.status(409).json({
          msg: "emailTaken",
        });
      }

      user = new User({
        email,
        password,
        firstVisit,
        settings: {
          notifications: true,
          theme: "light",
          language: "en",
        },
        rushCoins: 5,
      });
      const htmlTemplate = await fs.readFile(
        path.join(__dirname, "email_templates/email_confirm.html"),
        "utf-8"
      );

      const token = jwt.sign({ email }, EMAIL_SECRET, { expiresIn: "7d" });

      const html = htmlTemplate.replaceAll(
        "{{emailVerificationCode}}",
        `${process.env.BASE_URL}/auth/confirm-email?token=${token}`
      );

      user.save().then(() => {
        sendEmail({
          from: "support@rushpair.com",
          to: email,
          subject: `Confirm Your Account on RushPair`,
          html: html,
        });

        res.status(201).json({ msg: `Created new user "${email}"` });
      });
    } catch (err) {
      next(err);
    }
  }
);

auth.post(
  "/login",
  [
    check("email", "emailNotCorrect").isEmail(),
    check("password", "passwordRequired").exists(),
  ],
  rateLimiter,
  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(409).json({
          msg: "accountNotExists",
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(409).json({
          msg: "passwordIncorrect",
        });
      }

      if (!user.isVerified) {
        return res.status(409).json({
          msg: "accountNotVerified",
        });
      }

      const payload = {
        user: {
          email: email,
        },
      };

      jwt.sign(payload, JWT_SECRET, (err, token) => {
        if (err) throw err;
        res.json({ token });
      });
    } catch (err) {
      next(err);
    }
  }
);

auth.get("/confirm-email", async (req, res) => {
  const token = req.query.token;

  if (!token) {
    return res
      .status(400)
      .send(
        `<h1 style="width: 100%; text-align: center">Token is missing</h1>`
      );
  }

  try {
    const decoded = jwt.verify(token, EMAIL_SECRET);

    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      return res
        .status(404)
        .send(
          `<h1 style="width: 100%; text-align: center">User not found</h1>`
        );
    }

    if (user.isVerified) {
      return res
        .status(200)
        .send(
          `<h1 style="width: 100%; text-align: center">Email is already verified</h1>`
        );
    }

    user.isVerified = true;
    await user.save();

    res
      .status(200)
      .send(
        `<h1 style="width: 100%; text-align: center">Email successfully verified!</h1>`
      );
  } catch (error) {
    res
      .status(400)
      .send(
        `<h1 style="width: 100%; text-align: center">Invalid or expired link</h1>`
      );
  }
});

auth.post("/request-reset-password", async (req, res, next) => {
  const email = req.body.email;

  if (!email) {
    return res.status(400).send("Email is required");
  }

  try {
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ msg: "accountNotExists" });
    }

    const htmlTemplate = await fs.readFile(
      path.join(__dirname, "email_templates/request_password_reset.html"),
      "utf-8"
    );

    const resetToken = jwt.sign({ email: user.email }, JWT_SECRET, {
      expiresIn: "3h",
    });

    const html = htmlTemplate.replaceAll(
      "{{requestPasswordReset}}",
      `${process.env.BASE_URL}/auth/reset-password?token=${resetToken}`
    );

    await sendEmail({
      from: "support@rushpair.com",
      to: email,
      subject: `Reset Your Password`,
      html: html,
    });

    res.status(201).json({ msg: `passwordResetLinkSent` });
  } catch (error) {
    next(error);
  }
});

auth.get("/reset-password", async (req, res) => {
  const token = req.query.token;

  if (!token) {
    return res
      .status(400)
      .send(
        `<h1 style="width: 100%; text-align: center">Token is missing</h1>`
      );
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      return res
        .status(404)
        .send(
          `<h1 style="width: 100%; text-align: center">User not found</h1>`
        );
    }

    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    let newRandomPassword = "";

    for (let i = 0; i < 8; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      newRandomPassword += charset[randomIndex];
    }

    user.password = newRandomPassword;

    const htmlTemplate = await fs.readFile(
      path.join(__dirname, "email_templates/password_reset.html"),
      "utf-8"
    );

    const html = htmlTemplate.replaceAll(
      "{{newRandomPassword}}",
      newRandomPassword
    );

    await user.save().then(() => {
      sendEmail({
        from: "support@rushpair.com",
        to: decoded.email,
        subject: `Your new password`,
        html: html,
      });

      res
        .status(200)
        .send(
          `<h1 style="width: 100%; text-align: center">New password has been sent.</h1>`
        );
    });
  } catch (error) {
    console.error(error);
    res
      .status(400)
      .send(
        `<h1 style="width: 100%; text-align: center">Invalid or expired link.</h1>`
      );
  }
});

auth.get("/verify-token", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token missing" });
  }

  jwt.verify(token, JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }

    const user = await User.findOne(decoded.user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const today = new Date();
    const lastCoinsCollectionDate = new Date(user.lastCoinsCollection);

    if (
      !user.firstVisit &&
      user.rushCoins < 99 &&
      (!lastCoinsCollectionDate ||
        today.toDateString() !== lastCoinsCollectionDate.toDateString())
    ) {
      user.rushCoins += 1;
      user.lastCoinsCollection = today;
      await user.save();
      res.json({ user: user, coinsCollected: true });
    } else {
      res.json({ user: user });
    }
  });
});

auth.post(
  "/change-password",
  [
    check("email", "emailNotCorrect").isEmail(),
    check("oldPassword", "passwordRequired").notEmpty(),
    check("newPassword", "passwordTooShort").isLength({
      min: 6,
    }),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, oldPassword, newPassword } = req.body;

    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ msg: "userNotFound" });
      }

      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(409).json({ msg: "passwordIncorrect" });
      }

      user.password = newPassword;

      return await user.save().then(() => {
        return res.status(200).json({ msg: "passwordChangedSuccesfully" });
      });
    } catch (err) {
      next(err);
    }
  }
);

auth.post(
  "/delete-account",
  [check("password", "passwordRequired").notEmpty()],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ msg: errors.array()[0].msg });
    }

    const { email, password } = req.body;
    let user = await User.findOne({ email });

    try {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(409).json({ msg: "passwordIncorrect" });
      }

      let deletedUser = await User.findOneAndDelete({ email });

      if (!deletedUser) {
        return res.status(404).json({ msg: "userNotFound" });
      }

      res.status(200).json({ msg: "userDeletedSuccessfully" });
    } catch (err) {
      next(err);
    }
  }
);

export default auth;
