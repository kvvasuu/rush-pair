import { Server } from "socket.io";
import sharedSession from "express-socket.io-session";
import sessionMiddleware from "../session.js";
import { setupAdminNamespace } from "./adminNamespace.js";
import { setupUserNamespace } from "./userNamespace.js";
import { CLIENT_URL } from "../server.js";

let io;

export const initSocketIO = (server) => {
  io = new Server(server, {
    cors: {
      origin: CLIENT_URL,
      methods: ["GET", "POST"],
    },
  });

  io.use(sharedSession(sessionMiddleware, { autoSave: true }));

  setupAdminNamespace(io);
  setupUserNamespace(io);
};

export const getIO = () => io;
