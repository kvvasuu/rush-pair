import express from "express";
import { check, validationResult } from "express-validator";
import bcrypt from "bcryptjs/dist/bcrypt.js";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

const JWT_SECRET = "bTz8Kj%T&v9#LvD8j!7M@c4Hy92Xm&N^4tQZ2$wYFzRqS3GpJpP!";

router.post(
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

    try {
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(409)
          .json({ msg: "Email is already taken", error: "email-taken" });
      }

      user = new User({
        email,
        password,
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

router.post(
  "/login",
  [
    check("email", "Provide correct email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    console.log(req);
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
          email: user.email,
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

router.get("/verify-token", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token missing" });
  }

  jwt.verify(token, JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }

    const user = await User.findOne(decoded.email);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Zwróć dane użytkownika
    res.json({ user });
  });
});

export default router;
