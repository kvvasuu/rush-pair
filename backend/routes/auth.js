import express from "express";
import { check, validationResult } from "express-validator";
import * as fs from "node:fs/promises";
import path from "path";
import { __dirname } from "../app.js";
import bcrypt from "bcryptjs/dist/bcrypt.js";
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
    check("email", "Email is not correct").isEmail(),
    check("password", "Password must be at least 6 characters long").isLength({
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
          msg: "The provided email address is already registered in our system.",
        });
      }

      user = new User({
        email,
        password,
        firstVisit,
        settings: {
          notifications: true,
          theme: "light",
          language: "ENG",
        },
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
      next(error);
    }
  }
);

auth.post(
  "/login",
  [
    check("email", "Provide correct email").isEmail(),
    check("password", "Password is required").exists(),
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
          msg: "Account does not exists.",
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(409).json({
          msg: "Incorrect password.",
        });
      }

      if (!user.isVerified) {
        return res.status(409).json({
          msg: "Account not verified. Check your email address.",
        });
      }

      const payload = {
        user: {
          email: email,
        },
      };

      jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" }, (err, token) => {
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
      return res.status(404).json({ msg: "Account does not exists." });
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

    res
      .status(201)
      .json({ msg: `Password reset request has been set to ${email}.` });
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

    res.json({ user: user });
  });
});

auth.post(
  "/change-password",
  [
    check("email", "Email is not correct").isEmail(),
    check("oldPassword", "Old password is required").notEmpty(),
    check(
      "newPassword",
      "New password must be at least 6 characters long"
    ).isLength({
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
        return res.status(404).json({ msg: "User not found." });
      }

      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(409).json({ msg: "Old password is incorrect." });
      }

      user.password = newPassword;

      return await user.save().then(() => {
        return res.status(200).json({ msg: "Password changed successfully." });
      });
    } catch (err) {
      next(error);
    }
  }
);

auth.post(
  "/delete-account",
  [check("password", "Password is required").notEmpty()],
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
        return res.status(409).json({ msg: "Password is incorrect." });
      }

      let deletedUser = await User.findOneAndDelete({ email });

      if (!deletedUser) {
        return res.status(404).json({ msg: "User not found." });
      }

      res.status(200).json({ msg: "User deleted successfully." });
    } catch (err) {
      next(error);
    }
  }
);

export default auth;
