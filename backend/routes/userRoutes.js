import express from "express";
import authenticateToken from "./auth.js";
import User from "../models/User.js";
import Pair from "../models/Pair.js";
import multer from "multer";
import path from "path";
import { __dirname } from "../app.js";
import fs from "fs";
import sharp from "sharp";
import calculateYearsSince from "../utils.js";

const userRoutes = express.Router();

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

    user.name = name.trim || user.name;
    user.birthdate = birthdate || user.birthdate;
    user.gender = gender || user.gender;
    user.country = country.trim || user.country;
    user.city = city.trim || user.city;
    user.phoneNumber = phoneNumber.trim || user.phoneNumber;
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
    const updateQuery = {};

    for (const [key, value] of Object.entries(req.body.settings)) {
      updateQuery[`settings.${key}`] = value;
    }

    const user = await User.findOneAndUpdate(
      { email: req.body.email },
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
    res.status(500).json({ msg: "Server error" });
  }
});

userRoutes.get("/get-pairs/:email", authenticateToken, async (req, res) => {
  try {
    const pairs = await Pair.findOne({ email: req.params.email });

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
              name: pairedUser.name,
              imageUrl: pairedUser.imageUrl,
              isVisible: true,
            }
          : {
              id: pairedUser.id,
              pairedAt: el.pairedAt,
              isVisible: false,
            };
      })
    );

    const data = pairedWith.filter((el) => el !== null);
    res.json({ pairedWith: data });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});

userRoutes.get("/get-pair-chat/:id", authenticateToken, async (req, res) => {
  try {
    const pairChatUser = await User.findById(req.params.id);

    if (!pairChatUser) {
      return res.json({ pairChatUser: [] });
    }

    const age = calculateYearsSince(pairChatUser.birthdate);

    console.log(pairChatUser);
    const data = req.query.isVisible
      ? {
          id: pairChatUser.id,
          name: pairChatUser.name,
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
        };

    res.json({ pairChatUser: data });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});

export default userRoutes;
