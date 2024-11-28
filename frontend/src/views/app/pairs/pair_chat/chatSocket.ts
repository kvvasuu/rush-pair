import { reactive } from "vue";
import { io, Socket } from "socket.io-client";
import { Message } from "../../../../types";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

export const state = reactive({
  connected: false,
  roomId: "",
  message: <Message>{},
});

export const chatSocket: Socket = io(`${SERVER_URL}/chat`);

if (!chatSocket.hasListeners("connect")) {
  chatSocket.on("connect", () => {
    console.log("Socket connected");
    state.connected = true;
  });
}

if (!chatSocket.hasListeners("disconnect")) {
  chatSocket.on("disconnect", () => {
    state.connected = false;
  });
}

if (!chatSocket.hasListeners("roomJoined")) {
  chatSocket.on("roomJoined", (room) => {
    console.log("Joined room:", room);
    state.roomId = room;
  });
}

if (!chatSocket.hasListeners("getMessage")) {
  chatSocket.on("getMessage", (message: Message) => {
    state.message = message;
    console.log(state.message);
  });
}
