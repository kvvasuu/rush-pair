import express from "express";
import { check, validationResult } from "express-validator";
import bcrypt from "bcryptjs/dist/bcrypt.js";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// Rejestracja użytkownika
router.post(
  "/register",
  [
    check("name", "Name is required").not().isEmpty(),
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

    const { name, email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ msg: "Email is already taken", error: "email-taken" });
      }

      user = new User({
        name,
        email,
        password,
      });

      await user.save();

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(payload, "secretKey", { expiresIn: "1h" }, (err, token) => {
        if (err) throw err;
        res.json({ token });
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// Logowanie użytkownika
router.post(
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
        return res.status(400).json({ msg: "Incorrect login information" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: "Incorrect login information" });
      }

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(payload, "secretKey", { expiresIn: "1h" }, (err, token) => {
        if (err) throw err;
        res.json({ token });
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

export default router;
