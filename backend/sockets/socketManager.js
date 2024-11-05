import { Server } from "socket.io";
import sharedSession from "express-socket.io-session";
import sessionMiddleware from "../session.js";
import { CLIENT_URL } from "../server.js";
import ActiveUser from "../models/ActiveUser.js";

let io;

export const initSocketIO = (server) => {
  io = new Server(server, {
    cors: {
      origin: CLIENT_URL,
      methods: ["GET", "POST"],
    },
  });

  io.use(sharedSession(sessionMiddleware, { autoSave: true }));

  io.on("connection", async (socket) => {
    const activeUser = await User.findOne({
      email: socket.handshake.auth.email,
    });

    if (!activeUser) {
      socket.disconnect();
    }

    await ActiveUser.updateOne(
      { email: socket.handshake.auth.email },
      { $set: { socketId: socket.id, isAvailable: true } }
    );

    socket.emit("userAvailable", {
      action: "joined",
      message: `You have joined queue`,
    });

    console.log("User connected with socketId:", socket.id);

    socket.on("disconnect", async () => {
      await ActiveUser.deleteOne({ socketId: socket.id });
      console.log("User disconnected:", socket.id);
    });
  });

  /* setupUserNamespace(io); */
};

export const getIO = () => io;
