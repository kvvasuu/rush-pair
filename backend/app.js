import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/userRoutes.js";
import sessionMiddleware from "./session.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use(sessionMiddleware);

mongoose
  .connect(
    "mongodb+srv://RushPairUser:rushpair1!@rushpair.jt6i9.mongodb.net/?retryWrites=true&w=majority&appName=Rushpair"
  )
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error. Not connected to MongoDB:", err.message);
  });

app.use("/auth", authRoutes);
app.use("/user", userRoutes);

export default app;
