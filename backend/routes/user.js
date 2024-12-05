import express from "express";
import { authenticateToken } from "./auth.js";
import User from "../models/User.js";
import multer from "multer";
import path from "path";
import { __dirname } from "../app.js";
import fs from "fs";
import sharp from "sharp";
import { rateLimiter } from "../utils.js";

const user = express.Router();

user.use(rateLimiter);

const imagesStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "uploads"));
  },
  filename: (req, file, cb) => {
    const safeFileName = file.originalname.replace(/[@.]/g, "_");
    const date = Date.now();
    cb(null, `beforeresize_${safeFileName}_${date}.jpeg`);
  },
});

const imageUpload = multer({ storage: imagesStorage });

user.put(
  "/update-image",
  authenticateToken,
  imageUpload.single("profilePicture"),
  async (req, res, next) => {
    try {
      const user = await User.findOne({ email: req.user.user.email });

      if (!user) {
        return res.status(404).json({ msg: "User not found." });
      }

      const uploadedFilePath = path.join(
        __dirname,
        "uploads",
        req.file.filename
      );
      const resizedFilePath = path.join(
        __dirname,
        "uploads",
        req.file.filename.replace("beforeresize_", "")
      );

      await sharp(uploadedFilePath).resize(512, 512).toFile(resizedFilePath);
      fs.unlinkSync(uploadedFilePath);

      if (req.body.oldImageName) {
        fs.unlink(
          path.join(__dirname, "uploads", req.body.oldImageName),
          (err) => {
            if (err) {
              console.error("Failed to delete old file:", err);
            }
          }
        );
      }

      user.imageUrl = req.file.filename.replace("beforeresize_", "");

      await user.save();

      res.json({
        message: "Profile image updated successfully",
        imageUrl: user.imageUrl,
      });
    } catch (error) {
      next(error);
    }
  }
);

user.put("/update-profile", authenticateToken, async (req, res, next) => {
  try {
    const { name, birthdate, gender, country, city, phoneNumber, description } =
      req.body.userData;

    const user = await User.findOne({ email: req.user.user.email });

    if (!user) {
      return res.status(404).json({ msg: "User not found." });
    }

    user.name = name.trim() || user.name;
    user.birthdate = birthdate || user.birthdate;
    user.gender = gender || user.gender;
    user.country = country.trim() || user.country;
    user.city = city.trim() || user.city;
    user.phoneNumber = phoneNumber.trim() || user.phoneNumber;
    user.firstVisit = user.firstVisit && false;
    user.imageUrl = user.imageUrl;
    user.description = description || user.description;

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
        description: user.description,
      },
    });
  } catch (error) {
    next(error);
  }
});

user.patch("/change-settings", authenticateToken, async (req, res, next) => {
  try {
    const updateQuery = {};

    for (const [key, value] of Object.entries(req.body.settings)) {
      updateQuery[`settings.${key}`] = value;
    }

    const user = await User.findOneAndUpdate(
      { email: req.user.user.email },
      { $set: updateQuery },
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
    next(error);
  }
});

export default user;
