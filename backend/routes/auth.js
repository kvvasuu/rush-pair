import express from "express";
import { check, validationResult } from "express-validator";
import bcrypt from "bcryptjs/dist/bcrypt.js";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const auth = express.Router();

const JWT_SECRET = "bTz8Kj%T&v9#LvD8j!7M@c4Hy92Xm&N^4tQZ2$wYFzRqS3GpJpP!";

export const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1] || req.query.token;

  if (!token) {
    return res.status(403).json({ msg: "Token not provided" });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ msg: "Invalid token" });
    }

    req.user = decoded;
    next();
  });
};

auth.post(
  "/register",
  [
    check("email", "Email is not correct").isEmail(),
    check("password", "Password must be at least 6 characters long").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
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
          theme: "dark",
          language: "ENG",
        },
      });

      return await user.save().then(() => {
        return res.status(201).json({ msg: `Created new user "${email}"` });
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

auth.post(
  "/login",
  [
    check("email", "Provide correct email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(409).json({
          msg: "Email does not exists.",
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(409).json({
          msg: "Incorrect passord",
        });
      }

      const payload = {
        user: {
          email: email,
        },
      };

      jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" }, (err, token) => {
        if (err) throw err;
        res.json({ token });
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

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

    res.json({ user });
  });
});

export default auth;
