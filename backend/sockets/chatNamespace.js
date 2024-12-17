import Chat from "../models/Chat.js";
import Message from "../models/Message.js";
import Pair from "../models/Pair.js";
import User from "../models/User.js";
import ActiveUser from "../models/ActiveUser.js";
import { getIO } from "./socketManager.js";

export const setupChatNamespace = (io) => {
  const chatNamespace = io.of("/chat");

  chatNamespace.on("connection", (socket) => {
    console.log("Chat connection");
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
        const userEmail = await User.findById(userId, "email");

        socket.roomId = roomId;

        await Pair.findOneAndUpdate(
          { email: userEmail.email, "pairedWith.id": pairId },
          {
            $set: { "pairedWith.$.unreadMessagesCount": 0 },
          }
        );
        chatNamespace.to(roomId).emit("roomJoined", roomId, userId);
      } catch (err) {
        console.log(err);
      }
    });

    socket.on("sendMessage", async ({ content, sender, receiver }) => {
      try {
        const message = new Message({
          chatId: socket.roomId,
          sender: sender,
          content: content,
        });

        await message.save().then(async () => {
          const receiverEmail = await User.findById(receiver, "email");

          await Pair.findOneAndUpdate(
            { email: receiverEmail.email, "pairedWith.id": sender },
            {
              $inc: { "pairedWith.$.unreadMessagesCount": 1 },
            }
          );

          const receiverSocket = await ActiveUser.findOne({
            userId: receiver,
          });

          if (receiverSocket) {
            const rootNamespace = getIO();

            rootNamespace
              .to(receiverSocket.socketId)
              .emit("getMessage", sender);
          }

          chatNamespace
            .to(socket.roomId)
            .emit("getMessage", { sender, content, date: message.date });
        });
      } catch (err) {
        console.log(err);
      }
    });

    socket.on("readMessages", async ({ userId, pairId }) => {
      try {
        const userEmail = await User.findById(userId, "email");

        await Pair.findOneAndUpdate(
          { email: userEmail.email, "pairedWith.id": pairId },
          {
            $set: { "pairedWith.$.unreadMessagesCount": 0 },
          }
        );

        const dateNow = Date.now();

        await Message.updateMany(
          { chatId: socket.roomId, sender: pairId, isRead: false },
          { $set: { isRead: true, readAt: dateNow } }
        );

        chatNamespace
          .to(socket.roomId)
          .emit("readLastMessage", pairId, dateNow);
      } catch (err) {
        console.log(err);
      }
    });

    socket.on("startTyping", (pairId) => {
      chatNamespace.emit("startTyping", pairId);
    });

    socket.on("stopTyping", (pairId) => {
      chatNamespace.emit("stopTyping", pairId);
    });
    socket.on("disconnect", async () => {
      console.log("Chat disconnection");
    });
  });
};
