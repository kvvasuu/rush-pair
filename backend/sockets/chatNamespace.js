import Chat from "../models/Chat.js";
import Message from "../models/Message.js";
import mongoose from "mongoose";
import ActiveUser from "../models/ActiveUser.js";

export const setupChatNamespace = (io) => {
  const chatNamespace = io.of("/chat");

  chatNamespace.on("connection", (socket) => {
    socket.on("joinRoom", async ({ userId, pairId }) => {
      const roomId = [userId, pairId].sort().join("-");

      try {
        let chat = await Chat.findOne({ chatId: roomId });
        if (!chat) {
          chat = new Chat({
            chatId: roomId,
            participants: [userId, pairId],
          });

          await chat.save();
        }

        socket.join(roomId);
        chatNamespace.to(roomId).emit("roomJoined", roomId);
      } catch (err) {
        console.log(err);
      }
    });

    socket.on("sendMessage", async ({ roomId, content, sender }) => {
      try {
        const message = new Message({
          chatId: roomId,
          sender: sender,
          content: content,
        });

        await message.save().then(() => {
          chatNamespace
            .to(roomId)
            .emit("getMessage", { sender, content, date: message.date });
        });
      } catch (err) {
        console.log(err);
      }
    });

    socket.on("askForReveal", async (ids) => {
      try {
        const { userId, pairId } = ids;

        if (
          !userId ||
          !pairId ||
          !mongoose.Types.ObjectId.isValid(userId) ||
          !mongoose.Types.ObjectId.isValid(pairId)
        ) {
          return;
        }

        const pair = await ActiveUser.findOne({ userId: pairId });

        io.to(pair.socketId).emit("askedForReveal", pairId);
      } catch (error) {
        console.log(error);
      }
    });
  });
};
