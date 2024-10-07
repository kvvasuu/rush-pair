import {
  getAvailableRooms,
  removeUserFromRoom,
  rooms,
} from "../utils/roomManager.js";
import sharedSession from "express-socket.io-session";
import sessionMiddleware from "../session.js";
import { getIO } from "./socketManager.js";

export const setupUserNamespace = (io) => {
  const userNamespace = io.of("/users");

  userNamespace.use(sharedSession(sessionMiddleware, { autoSave: true }));

  userNamespace.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;

    socket.handshake.session.userId = userId;
    socket.handshake.session.save();

    console.log("User connected:", userId);

    socket.on("getAvailableRooms", () => {
      if (rooms) socket.emit("getAvailableRooms", getAvailableRooms(rooms));
    });

    socket.on("joinRoom", (roomName, userName) => {
      if (rooms.has(roomName)) {
        const user = {
          name: userName,
          userId: userId,
        };

        rooms.get(roomName).users.push(user);
        socket.join(roomName);
        socket.emit("rooms", {
          action: "joined",
          message: `You have joined room ${roomName}`,
        });
        getIO()
          .of("/admin")
          .to(roomName)
          .emit("users", {
            action: "joined",
            message: `User "${userId}" joined the room.`,
            user: user,
          });
      } else {
        socket.emit("error", "Room does not exist");
      }
    });

    socket.on("leaveRoom", (roomName) => {
      if (rooms.has(roomName)) {
        const userSocket = io.sockets.sockets.get(userId);
        const users = rooms.get(roomName).users;
        const user = users.find((user) => user.userId === userId);

        if (userSocket) {
          userSocket.leave(roomName);
          removeUserFromRoom(roomName, userId);
        }

        getIO()
          .of("/admin")
          .to(roomName)
          .emit("users", {
            action: "left",
            message: `User "${userId}" left the room.`,
            user: user,
          });

        socket.emit("rooms", {
          action: "left",
          message: `You left the room "${roomName}"`,
        });
      } else {
        socket.emit("error", "Room does not exist");
      }
    });

    socket.on("disconnect", () => {
      console.log(`User ${userId} disconnected`);
    });
  });
};
