import {
  getAvailableRooms,
  removeUserFromRoom,
  rooms,
} from "../utils/roomManager.js";
import sharedSession from "express-socket.io-session";
import sessionMiddleware from "../session.js";
import { getIO } from "./socketManager.js";

export const setupAdminNamespace = (io) => {
  const adminNamespace = io.of("/admin");

  adminNamespace.use(sharedSession(sessionMiddleware, { autoSave: true }));

  adminNamespace.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    socket.handshake.session.userId = userId;
    socket.handshake.session.save();

    console.log("Admin connected:", userId);

    socket.on("createRoom", (roomName) => {
      let roomId = "";
      do {
        roomId = `room-${Math.random().toString(36).slice(2, 9)}`;
      } while (rooms.has(roomId));

      rooms.set(roomId, { roomName: roomName, users: [] });
      socket.join(roomId);
      socket.emit("rooms", {
        action: "created",
        message: `Room '${roomName}' has been created.`,
        room: { roomId, roomName },
      });
      getIO().of("/users").emit("getAvailableRooms", getAvailableRooms(rooms));
    });

    socket.on("closeRoom", (roomId) => {
      if (rooms.has(roomId)) {
        const room = rooms.get(roomId);

        getIO()
          .of("/users")
          .to(roomId)
          .emit("rooms", {
            action: "closed",
            message: `Room '${room.roomName}' has been closed.`,
          });
        socket.emit("rooms", {
          action: "closed",
          message: `Room '${room.roomName}' has been closed.`,
        });

        room.users.forEach((userId) => {
          getIO().sockets.sockets.get(userId)?.leave(roomId);
        });

        rooms.delete(roomId);
        getIO()
          .of("/users")
          .emit("getAvailableRooms", getAvailableRooms(rooms));
      }
    });

    socket.on("kickUser", (userId, roomId) => {
      const userSocket = getIO().sockets.sockets.get(userId);
      const room = rooms.get(roomId);
      if (userSocket) {
        userSocket.leave(roomId);
        userSocket.emit(
          "roomLeft",
          `You were kicked from room ${room.roomName}`
        );
        socket.emit(
          "userKicked",
          `User ${userId} was kicked from room ${room.roomName}`
        );
        removeUserFromRoom(roomId, userId);
      } else {
        socket.emit("error", "User not found");
      }
    });

    socket.on("sendGlobalMessage", (message) => {
      getIO().emit("globalMessage", message);
    });

    socket.on("disconnect", () => {
      console.log("Admin disconnected");
    });
  });
};
