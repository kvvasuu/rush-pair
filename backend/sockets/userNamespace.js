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

    users.push({ userId: userId });

    console.log("User connected:", userId);

    socket.on("getAvailableRooms", () => {
      console.log(users);
      if (rooms) socket.emit("getAvailableRooms", getAvailableRooms(rooms));
    });

    socket.on("joinRoom", (roomId, userName) => {
      if (rooms.has(roomId)) {
        const room = rooms.get(roomId);
        const roomName = room.roomName;
        const user = {
          name: userName,
          userId: userId,
        };

        room.users.push(user);

        socket.join(roomId);

        socket.emit("rooms", {
          action: "joined",
          message: `You have joined room ${roomName}`,
          room: { roomId, roomName },
        });
        getIO()
          .of("/admin")
          .to(roomId)
          .emit("users", {
            action: "joined",
            message: `User "${userId}" joined the room.`,
            user: user,
          });
      } else {
        socket.emit("error", "Room does not exist");
      }
    });

    socket.on("leaveRoom", (roomId) => {
      if (rooms.has(roomId)) {
        const room = rooms.get(roomId);
        const users = room.users;
        const user = users.find((user) => user.userId === userId);

        socket.leave(roomId);
        removeUserFromRoom(roomId, userId);

        getIO()
          .of("/admin")
          .to(roomId)
          .emit("users", {
            action: "left",
            message: `User "${userId}" left the room.`,
            user: user,
          });

        socket.emit("rooms", {
          action: "left",
          message: `You left the room "${room.roomName}"`,
        });
      } else {
        socket.emit("error", "Room does not exist");
      }
    });

    socket.on("disconnect", () => {
      console.log(`User ${userId} disconnected`);
      users = users.filter((el) => el.userId !== userId);
    });
  });
};
