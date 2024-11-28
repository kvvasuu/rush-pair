import Chat from "../models/Chat.js";
import Message from "../models/Message.js";

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
          chatNamespace.to(roomId).emit("getMessage", content, sender);
          console.log(message);
        });
      } catch (err) {
        console.log(err);
      }
    });

    socket.on("disconnect", () => {
      console.log("Użytkownik rozłączony:", socket.id);
    });
  });
};
