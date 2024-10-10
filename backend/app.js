import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";
import sessionMiddleware from "./session.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use(sessionMiddleware);

mongoose
  .connect("mongodb://localhost:27017/rush-pair")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error. Not connected to MongoDB:", err.message);
  });

app.use("/auth", authRoutes);

export default app;
