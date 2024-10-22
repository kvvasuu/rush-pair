import express from "express";
import authenticateToken from "./auth.js";
import User from "../models/User.js";
import multer from "multer";
import path from "path";
import { __dirname } from "../app.js";

const userRoutes = express.Router();

const imagesStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "uploads"));
  },
  filename: (req, file, cb) => {
    const safeFileName = file.originalname.replace(/[@.]/g, "_");
    cb(null, `${safeFileName}.png`);
  },
});

const imageUpload = multer({ storage: imagesStorage });

userRoutes.put(
  "/update-image",
  authenticateToken,
  imageUpload.single("profilePicture"),
  async (req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email });

      if (!user) {
        return res.status(404).json({ msg: "User not found." });
      }

      user.imageUrl = req.file.filename;

      await user.save();

      res.json({
        message: "Profile image updated successfully",
        imageUrl: user.imageUrl,
      });
    } catch (error) {
      res.status(500).json({ msg: "Server error" });
    }
  }
);

userRoutes.put("/update-profile", authenticateToken, async (req, res) => {
  try {
    const { name, birthdate, gender, country, city, phoneNumber } =
      req.body.userData;

    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({ msg: "User not found." });
    }

    user.name = name || user.name;
    user.birthdate = birthdate || user.birthdate;
    user.gender = gender || user.gender;
    user.country = country || user.country;
    user.city = city || user.city;
    user.phoneNumber = phoneNumber || user.phoneNumber;
    user.firstVisit = user.firstVisit && false;
    user.imageUrl = user.imageUrl;

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user: {
        name: user.name,
        birthdate: user.birthdate,
        gender: user.gender,
        country: user.country,
        city: user.city,
        phoneNumber: user.phoneNumber,
        firstVisit: user.firstVisit,
        imageUrl: user.imageUrl,
      },
    });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});

userRoutes.patch("/change-settings", authenticateToken, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.body.email,
      { $set: { settings: req.body.settings } },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ msg: "User not found." });
    }

    res.json({
      message: "Settings changed",
      settings: req.body.settings,
    });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});

export default userRoutes;
