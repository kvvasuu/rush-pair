import { defineStore } from "pinia";
import { ChatStoreState } from "../types";
import { useUserStore } from "./userStore";
import { io, Socket } from "socket.io-client";
import { Message } from "../types";
import axios from "axios";
import { socket } from "./userStore";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const chatSocket: Socket = io(`${SERVER_URL}/chat`, {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
});

export const useChatStore = defineStore("chatStore", {
  state: (): ChatStoreState => ({
    pairInfo: {
      id: "",
      name: "",
      age: 16,
      gender: "other",
      imageUrl: "",
      isVisible: false,
      city: "",
      description: "",
      pairedAt: 0,
      isActive: false,
      askedForReveal: false,
      hasBeenAskedForReveal: false,
    },
    currentPage: 1,
    messages: [],
    newMessage: null,
    isLoading: false,
    connected: false,
    roomId: "",
  }),
  actions: {
    async openChat(id: string) {
      const userStore = useUserStore();

      const pair = userStore.pairs.find((pair) => pair.id === id);

      if (!pair) {
        return;
      }
      try {
        const res = await axios.get(`/chat/get-pair-chat/${id}`);

        if (res.status === 200) {
          this.pairInfo = { ...res.data.pairChatUser };
          return true;
        } else {
          return false;
        }
      } catch (error) {
        console.log(error);
      }
    },
    async changePairNickname() {
      const userStore = useUserStore();

      try {
        const res = await axios.put(
          `/chat/change-pair-nickname/${this.pairInfo.id}`,
          {
            nickname: this.pairInfo.name,
          }
        );

        if (res.status === 200) {
          const pair = userStore.pairs.find(
            (pair) => pair.id === this.pairInfo.id
          );
          if (pair) {
            pair.name = res.data.nickname;
          }
          return true;
        } else {
          return false;
        }
      } catch (error) {
        console.log(error);
      }
    },
    closeChat() {
      this.$reset();
    },
    async loadMessages(): Promise<boolean> {
      const userStore = useUserStore();
      this.isLoading = true;
      const chatId = [userStore.id, this.pairInfo.id].sort().join("-");
      try {
        const response = await axios.get(
          `${SERVER_URL}/chat/get-messages/${chatId}`,
          {
            headers: { Authorization: `Bearer ${userStore.token}` },
            params: { page: this.currentPage, limit: 50 },
          }
        );
        if (response.data.length > 0) {
          this.messages = [...this.messages, ...response.data];
          this.currentPage++;
          this.isLoading = false;
          return true;
        } else {
          this.isLoading = false;
          return false;
        }
      } catch (error) {
        console.error("Error while loading messages from server: ", error);
        return false;
      }
    },
    async sendMessage(message: string) {
      const userStore = useUserStore();

      let messageToSend = "";

      !message ? (messageToSend = "\u2764\uFE0F") : (messageToSend = message);

      chatSocket.emit("sendMessage", {
        roomId: this.roomId,
        content: messageToSend,
        sender: userStore.id,
      });
    },
    bindEvents() {
      if (!chatSocket.hasListeners("connect")) {
        chatSocket.on("connect", () => {
          this.connected = true;
        });
      }

      if (!chatSocket.hasListeners("disconnect")) {
        chatSocket.on("disconnect", () => {
          this.connected = false;
        });
      }

      if (!chatSocket.hasListeners("roomJoined")) {
        chatSocket.on("roomJoined", (room) => {
          this.roomId = room;
        });
      }
      if (!chatSocket.hasListeners("getMessage")) {
        chatSocket.on("getMessage", (message: Message) => {
          this.messages.unshift(message);
          this.newMessage = message;
        });
      }
      if (!socket.hasListeners("askedForReveal")) {
        socket.on("askedForReveal", () => {
          this.pairInfo.askedForReveal = true;
        });
      }
      if (!socket.hasListeners("setPairVisible")) {
        socket.on("setPairVisible", () => {
          this.openChat(this.pairInfo.id);
        });
      }
    },
    removeEvents() {
      socket.removeAllListeners("askedForReveal");
      socket.removeAllListeners("setPairVisible");
    },
    async connectToSocket() {
      const userStore = useUserStore();

      chatSocket.connect();
      this.bindEvents();

      chatSocket.emit("joinRoom", {
        userId: userStore.id,
        pairId: this.pairInfo.id,
      });
    },
    disconnectFromSocket() {
      chatSocket.disconnect();
      this.removeEvents();
    },
    async askForReveal() {
      const userStore = useUserStore();
      try {
        const res = await axios.post(`/chat/ask-for-reveal`, {
          userId: userStore.id,
          pairId: this.pairInfo.id,
        });

        if (res) this.pairInfo.hasBeenAskedForReveal = true;
      } catch (error) {
        console.log(error);
      }
    },
  },
});
