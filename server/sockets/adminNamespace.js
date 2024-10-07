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
      if (rooms.has(roomName)) {
        socket.emit("rooms", {
          action: "exists",
          message: `Room '${roomName}' already exists.`,
        });
      } else {
        rooms.set(roomName, { users: [] });
        socket.join(roomName);
        socket.emit("rooms", {
          action: "created",
          message: `Room '${roomName}' has been created.`,
        });
        getIO()
          .of("/users")
          .emit("getAvailableRooms", getAvailableRooms(rooms));
      }
    });

    socket.on("closeRoom", (roomName) => {
      if (rooms.has(roomName)) {
        const room = rooms.get(roomName);

        getIO()
          .of("/users")
          .to(roomName)
          .emit("rooms", {
            action: "closed",
            message: `Room '${roomName}' has been closed.`,
          });
        socket.emit("rooms", {
          action: "closed",
          message: `Room '${roomName}' has been closed.`,
        });

        room.users.forEach((userId) => {
          getIO().sockets.sockets.get(userId)?.leave(roomName);
        });

        rooms.delete(roomName);
        getIO()
          .of("/users")
          .emit("getAvailableRooms", getAvailableRooms(rooms));
      }
    });

    socket.on("kickUser", (userId, roomName) => {
      const userSocket = getIO().sockets.sockets.get(userId);
      if (userSocket) {
        userSocket.leave(roomName);
        userSocket.emit("roomLeft", `You were kicked from room ${roomName}`);
        socket.emit(
          "userKicked",
          `User ${userId} was kicked from room ${roomName}`
        );
        removeUserFromRoom(roomName, userId);
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
