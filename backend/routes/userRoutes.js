import express from "express";
import authenticateToken from "./auth.js";
import User from "../models/User.js";

const userRoutes = express.Router();

userRoutes.put("/update-profile", authenticateToken, async (req, res) => {
  try {
    const { name, birthdate, gender, country, city, phoneNumber } =
      req.body.userData;

    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({ msg: "User not found." });
    }

    console.log(req.body.userData);

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
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
});

export default userRoutes;
