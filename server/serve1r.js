import express from "express";
import session from "express-session";
import { createServer } from "http";
import cors from "cors";
import { Server } from "socket.io";
import sharedSession from "express-socket.io-session";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Adres Twojego frontendu
    methods: ["GET", "POST"],
  },
});

app.use(cors());

const sessionMiddleware = session({
  secret: "super-secret-key",
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 },
});
app.use(sessionMiddleware);

io.use(
  sharedSession(sessionMiddleware, {
    autoSave: true,
  })
);

const adminNamespace = io.of("/admin");
const userNamespace = io.of("/users");

// Mapa przechowująca pokoje
const rooms = new Map();

const removeUserFromRoom = (roomName, userId) => {
  if (rooms.has(roomName)) {
    const users = rooms.get(roomName);

    const updatedUsers = users.filter((user) => user.userId !== userId);

    rooms.set(roomName, updatedUsers);
  }
};

const getAvailableRooms = (rooms) => {
  return Array.from(rooms, ([key, value]) => ({
    roomName: key,
    users: value.users.length,
  }));
};

// Admin namespace
adminNamespace.use(sharedSession(sessionMiddleware, { autoSave: true }));

adminNamespace.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  socket.handshake.session.userId = userId;
  socket.handshake.session.save();

  console.log("Admin connected:", socket.handshake.session.userId);

  // Tworzenie pokoju
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
      userNamespace.emit("getAvailableRooms", getAvailableRooms(rooms));
    }
  });

  socket.on("closeRoom", (roomName) => {
    if (rooms.has(roomName)) {
      const room = rooms.get(roomName);

      // Powiadomienie użytkowników o zamknięciu pokoju
      userNamespace.to(roomName).emit("rooms", {
        action: "closed",
        message: `Room '${roomName}' has been closed.`,
      });

      adminNamespace.to(roomName).emit("rooms", {
        action: "closed",
        message: `Room '${roomName}' has been closed.`,
      });

      // Odłączenie wszystkich użytkowników i usunięcie pokoju
      room.users.forEach((userId) => {
        io.sockets.sockets.get(userId)?.leave(roomName);
      });
      socket.leave(roomName);
      rooms.delete(roomName);
      userNamespace.emit("getAvailableRooms", getAvailableRooms(rooms));
      console.log(`Room '${roomName}' has been closed`);
    } else {
      socket.emit("error", `Room '${roomName}' does not exist.`);
    }
  });

  socket.on("sendGlobalMessage", (message) => {
    io.emit("globalMessage", message); // Wysyła do głównego namespace (wszystkich podłączonych)
  });

  socket.on("kickUser", (userId, roomName) => {
    const userSocket = io.sockets.sockets.get(userId); // Pobiera socket użytkownika
    if (userSocket) {
      userSocket.leave(roomName);
      userSocket.emit("roomLeft", `You were kicked from room ${roomName}`);
      adminNamespace
        .to(roomName)
        .emit("userKicked", `User ${userId} was kicked from room ${roomName}`);
    } else {
      socket.emit("error", "User not found");
    }
  });

  socket.on("disconnect", () => {
    console.log("Admin disconnected");
  });
});

// User namespace
userNamespace.use(sharedSession(sessionMiddleware, { autoSave: true }));

userNamespace.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  socket.handshake.session.userId = userId;
  socket.handshake.session.save();

  console.log("User connected:", socket.handshake.session.userId);

  socket.on("getAvailableRooms", () => {
    if (rooms) socket.emit("getAvailableRooms", getAvailableRooms(rooms));
  });

  socket.on("joinRoom", (roomName, userName) => {
    if (rooms.has(roomName)) {
      const user = { name: userName, userId: socket.handshake.session.userId };

      rooms.get(roomName).users.push(user);
      socket.join(roomName);
      socket.emit("rooms", {
        action: "joined",
        message: `You have joined room ${roomName}`,
      });
      adminNamespace.to(roomName).emit("users", {
        action: "joined",
        message: `User "${user.name}" joined the room.`,
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
        removeUserFromRoom("room1", socket.handshake.session.userId);
      }

      adminNamespace
        .to(roomName)
        .emit("userLeft", socket.handshake.session.userId);

      adminNamespace.to(roomName).emit("users", {
        action: "left",
        message: `User "${user.name}" left the room.`,
        user: user,
      });

      socket.emit("rooms", {
        action: "left",
        message: `You left the room "${roomName}"`,
      });

      console.log(rooms);
    } else {
      socket.emit("error", "Room does not exist");
    }
  });

  socket.on("disconnect", () => {
    console.log(`User ${socket.handshake.session.userId} disconnected`);
  });
});

io.on("connection", (socket) => {
  const userId = socket.handshake.session.userId;

  console.log(`Użytkownik połączony w głównym namespace: ${userId}`);

  socket.on("disconnect", () => {
    console.log(`Użytkownik rozłączony w głównym namespace: ${userId}`);
  });
});

app.get("/get-user-id", (req, res) => {
  if (!req.session.userId) {
    req.session.userId = `user-${Math.random().toString(36).slice(2, 9)}`;
    console.log(`User ${req.session.userId} connected.`);
  } else if (req.session.userId) {
    console.log(`User ${req.session.userId} reconnected.`);
  }
  res.json({
    userId: req.session.userId,
  });
});

app.get("/status", (req, res) => {
  res.status(200).send("Server is running");
});

server.listen(3000, () => {
  console.log(`Server running on port 3000`);
});
