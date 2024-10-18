import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import path from "path";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/userRoutes.js";
import sessionMiddleware from "./session.js";
import { authenticateToken } from "./routes/auth.js";
import "dotenv/config";

export const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const MONGODB_KEY =
  process.env.MONGODB_KEY ||
  "mongodb+srv://RushPairUser:rushpair1!@rushpair.jt6i9.mongodb.net/?retryWrites=true&w=majority&appName=Rushpair";

app.use(
  "/uploads",
  authenticateToken,
  express.static(path.join(__dirname, "uploads"))
);
app.use(express.json());
app.use(cors());
app.use(sessionMiddleware);

console.log(__dirname);

mongoose
  .connect(MONGODB_KEY)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error. Not connected to MongoDB:", err.message);
  });

app.use("/auth", authRoutes);
app.use("/user", userRoutes);

export default app;
