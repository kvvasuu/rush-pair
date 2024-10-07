import express from "express";
import cors from "cors";
import sessionMiddleware from "./session.js";

const app = express();

app.use(cors());
app.use(sessionMiddleware);

app.get("/status", (req, res) => {
  res.status(200).send("Server is running");
});

app.get("/get-user-id", (req, res) => {
  if (!req.session.userId) {
    req.session.userId = `user-${Math.random().toString(36).slice(2, 9)}`;
    console.log(`User ${req.session.userId} connected.`);
  } else {
    console.log(`User ${req.session.userId} reconnected.`);
  }
  res.json({ userId: req.session.userId });
});

export default app;
