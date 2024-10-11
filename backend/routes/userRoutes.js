import express from "express";
import authenticateToken from "./auth.js";
import User from "../models/User.js";

const userRoutes = express.Router();

userRoutes.put("/update-profile", authenticateToken, async (req, res) => {
  try {
    const { name, age, gender, country, city, phoneNumber } = req.body.userData;

    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({ msg: "User not found." });
    }

    user.name = name || user.name;
    user.age = age || user.age;
    user.gender = gender || user.gender;
    user.country = country || user.country;
    user.city = city || user.city;
    user.phoneNumber = phoneNumber || user.phoneNumber;
    user.firstVisit = req.body.firstVisit;

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        age: user.age,
        gender: user.gender,
        country: user.country,
        city: user.city,
        phoneNumber: user.phoneNumber,
        firstVisit: user.firstVisit,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
});

export default userRoutes;
