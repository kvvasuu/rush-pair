import { Server } from "socket.io";
import { CLIENT_URL } from "../server.js";
import ActiveUser from "../models/ActiveUser.js";
import { setupChatNamespace } from "./chatNamespace.js";

let io;

export const initSocketIO = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", async (socket) => {
    socket.on("login", async (userId) => {
      try {
        let activeUser = await ActiveUser.findOne({
          socketId: socket.id,
        });

        if (!activeUser) {
          activeUser = new ActiveUser({
            userId: userId,
            isAvailable: false,
            socketId: socket.id,
          });
          await activeUser.save();
        }
      } catch (error) {
        console.log(error);
      }
    });

    socket.on("logout", async () => {
      try {
        await ActiveUser.findOneAndDelete({ socketId: socket.id });
      } catch (error) {
        console.log(error);
      }
    });

    /* socket.on("startPairing", async (userId) => {
      try {
        await ActiveUser.findOneAndUpdate(
          { userId: userId },
          { $set: { isAvailable: true } },
          { new: true, runValidators: true }
        );

        socket.emit("userAvailable", {
          action: "joined",
          message: `You have joined queue`,
        });
      } catch (error) {
        console.log(error);
      }
    }); */

    socket.on("disconnect", async () => {
      try {
        await ActiveUser.findOneAndDelete({ socketId: socket.id });
      } catch (error) {
        console.log(error);
      }
    });
  });

  setupChatNamespace(io);
};

export const getIO = () => io;
