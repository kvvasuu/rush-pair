import { Server } from "socket.io";
import ActiveUser from "../models/ActiveUser.js";
import Pair from "../models/Pair.js";
import User from "../models/User.js";
import { setupChatNamespace } from "./chatNamespace.js";
import mongoose from "mongoose";

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

    socket.on("startPairing", async (userId) => {
      try {
        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
          return;
        }

        await ActiveUser.findOneAndUpdate(
          { userId: userId },
          { $set: { isAvailable: true } },
          { upsert: true, new: true }
        );

        const user = await User.findOne({ _id: userId }).select("email");

        socket.emit("joinedPairing", {
          message: `You have joined queue.`,
        });

        const pairs = await Pair.findOne({ email: user.email });

        let pairedUserIds = [];
        if (pairs) pairedUserIds = pairs?.pairedWith?.map((p) => p.id);

        const randomUser = await ActiveUser.findOneAndUpdate(
          {
            isAvailable: true,
            $and: [
              {
                userId: { $ne: new mongoose.Types.ObjectId(userId) },
              },
              {
                userId: {
                  $nin: pairedUserIds.map(
                    (id) => new mongoose.Types.ObjectId(id)
                  ),
                },
              },
            ],
          },
          { $set: { isAvailable: false } },
          { new: true }
        );

        if (!randomUser) {
          socket.emit("emptyQueue", {
            message: `There are no active users to pair.`,
          });
          return;
        }

        await ActiveUser.updateOne(
          { userId: userId },
          { $set: { isAvailable: false } }
        );

        const pairedUser = await User.findOne({
          _id: randomUser.userId,
        }).select("email");

        if (!pairedUser) {
          socket.emit("emptyQueue", {
            message: `There are no active users to pair.`,
          });
          return;
        }

        await Pair.updateOne(
          { email: user.email },
          {
            $addToSet: { pairedWith: { id: randomUser.userId.toString() } },
          },
          { upsert: true }
        );

        await Pair.updateOne(
          { email: pairedUser.email },
          { $addToSet: { pairedWith: { id: userId.toString() } } },
          { upsert: true }
        );

        socket.emit("paired", {
          pairId: randomUser.userId,
          message: `Paired with ${randomUser.userId}`,
        });

        if (randomUser.socketId) {
          socket.to(randomUser.socketId).emit("paired", {
            pairId: userId,
            message: `Paired with ${userId}`,
          });
        }
      } catch (error) {
        console.log(error);
      }
    });

    socket.on("stopPairing", async (userId) => {
      try {
        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
          return;
        }

        const activeUser = await ActiveUser.findOneAndUpdate(
          { userId: userId },
          { $set: { isAvailable: false } },
          { new: true }
        );

        socket.emit("leftPairing", {
          message: `You left queue.`,
        });
      } catch (error) {
        console.log(error);
      }
    });

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

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};
