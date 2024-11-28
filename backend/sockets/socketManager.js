import { Server } from "socket.io";
import { CLIENT_URL } from "../server.js";
import ActiveUser from "../models/ActiveUser.js";
import { setupChatNamespace } from "./chatNamespace.js";

let io;

export const initSocketIO = (server) => {
  io = new Server(server, {
    cors: {
      origin: CLIENT_URL,
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", async (socket) => {
    /* const activeUser = await User.findOne({
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

    console.log("User connected with socketId:", socket.id); */

    socket.on("disconnect", async () => {
      /* await ActiveUser.deleteOne({ socketId: socket.id }); */
      console.log("User disconnected:", socket.id);
    });
  });

  setupChatNamespace(io);
};

export const getIO = () => io;
