import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import path from "path";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import chatRoutes from "./routes/chat.js";
import { authenticateToken } from "./routes/auth.js";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

export const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

const MONGODB_KEY = process.env.MONGODB_KEY;

app.use(
  "/uploads",
  authenticateToken,
  express.static(path.join(__dirname, "uploads"))
);
app.use(express.json());

mongoose
  .connect(MONGODB_KEY)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error. Not connected to MongoDB:", err.message);
  });
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/chat", chatRoutes);

export default app;
