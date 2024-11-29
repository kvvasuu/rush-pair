import { io, Socket } from "socket.io-client";
import { Message } from "../../../../types";

if (!chatSocket.hasListeners("getMessage")) {
  chatSocket.on("getMessage", (message: Message) => {
    state.message = message;
    console.log(state.message);
  });
}
