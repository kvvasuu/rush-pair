export const setupChatNamespace = (io) => {
  const chatNamespace = io.of("/chat");

  chatNamespace.on("connection", (socket) => {
    socket.on("joinRoom", ({ userId, contactId }) => {
      const roomId = [userId, contactId].sort().join("-");

      socket.join(roomId);
      chatNamespace.to(roomId).emit("roomJoined", roomId);
    });

    socket.on("sendMessage", ({ roomId, message, sender }) => {
      chatNamespace.to(roomId).emit("getMessage", message, sender);
      console.log({ roomId, message, sender });
    });

    socket.on("disconnect", () => {
      console.log("Użytkownik rozłączony:", socket.id);
    });
  });
};
