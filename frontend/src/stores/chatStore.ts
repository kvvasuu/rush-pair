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
      unreadMessagesCount: 0,
      isBlocked: false,
      isFavourite: false,
    },
    currentPage: 1,
    hasMoreMessages: true,
    messages: [],
    isLoading: false,
    connected: false,
    roomId: "",
    isTyping: false,
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
      if (!this.hasMoreMessages || this.isLoading) return false;

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
        } else {
          this.hasMoreMessages = false;
        }
      } catch (error) {
        console.error("Error while loading messages from server: ", error);
      } finally {
        this.isLoading = false;
      }

      return this.hasMoreMessages;
    },

    async sendMessage(message: string) {
      const userStore = useUserStore();

      chatSocket.emit("sendMessage", {
        content: message,
        sender: userStore.id,
        receiver: this.pairInfo.id,
      });
    },
    async deleteMessage(message: Message) {
      const userStore = useUserStore();
      try {
        const response = await axios.patch(
          `${SERVER_URL}/chat/delete-message/${message._id}`,
          {
            headers: { Authorization: `Bearer ${userStore.token}` },
            sender: message.sender,
          }
        );
        if (response.status === 200) {
          const { _id, isDeleted, sender, date } = response.data;
          let messageToChangeIndex = this.messages.findIndex(
            (msg) => msg._id === _id
          );
          this.messages[messageToChangeIndex] = {
            _id,
            isDeleted,
            sender,
            content: "",
            date,
          };
        }
      } catch (error) {
        console.error(error);
      }
    },
    setMessagesStatusToRead() {
      const userStore = useUserStore();

      this.pairInfo.unreadMessagesCount = 0;
      const pairIndex = userStore.pairs.findIndex(
        (pair) => pair.id === this.pairInfo.id
      );
      userStore.pairs[pairIndex].unreadMessagesCount = 0;

      chatSocket.emit("readMessages", {
        userId: userStore.id,
        pairId: this.pairInfo.id,
      });
    },
    startTyping() {
      chatSocket.emit("startTyping", this.pairInfo.id);
    },
    stopTyping() {
      chatSocket.emit("stopTyping", this.pairInfo.id);
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
        chatSocket.on("roomJoined", (room, userId) => {
          this.roomId = room;
          if (userId === this.pairInfo.id) {
            this.pairInfo.isActive = true;
          }
        });
      }
      if (!chatSocket.hasListeners("getMessage")) {
        chatSocket.on("getMessage", (message: Message) => {
          this.messages.unshift(message);
          if (message.sender === this.pairInfo.id)
            this.pairInfo.unreadMessagesCount++;
          this.isTyping = false;
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
      if (!chatSocket.hasListeners("startTyping")) {
        chatSocket.on("startTyping", (pairId) => {
          const userStore = useUserStore();
          if (pairId === userStore.id) this.isTyping = true;
        });
      }
      if (!chatSocket.hasListeners("stopTyping")) {
        chatSocket.on("stopTyping", (pairId) => {
          const userStore = useUserStore();
          if (pairId === userStore.id) this.isTyping = false;
        });
      }
      if (!chatSocket.hasListeners("readLastMessage")) {
        chatSocket.on("readLastMessage", (pairId, dateNow) => {
          const userStore = useUserStore();
          if (
            pairId === userStore.id &&
            this.messages.length > 0 &&
            !this.messages[0]?.isDeleted
          ) {
            this.messages[0].isRead = true;
            this.messages[0].readAt = dateNow;
          }
        });
      }
      if (!socket.hasListeners("youAreBlocked")) {
        socket.on("youAreBlocked", (pairId) => {
          const userStore = useUserStore();
          if (pairId === userStore.id) this.pairInfo.isBlocked = true;
        });
      }
    },
    removeEvents() {
      socket.removeAllListeners("askedForReveal");
      socket.removeAllListeners("setPairVisible");
      chatSocket.removeAllListeners("startTyping");
      chatSocket.removeAllListeners("stopTyping");
      chatSocket.removeAllListeners("readLastMessage");
      socket.removeAllListeners("youAreBlocked");
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
    async askForReveal(): Promise<string | boolean> {
      const userStore = useUserStore();
      try {
        const res = await axios.post(`/chat/ask-for-reveal`, {
          userId: userStore.id,
          pairId: this.pairInfo.id,
        });

        if (res) {
          this.pairInfo.hasBeenAskedForReveal = true;
          userStore.rushCoins = userStore.rushCoins - 5;
          return true;
        }
        return false;
      } catch (error: any) {
        if (error.response?.data?.msg === "notEnoughRushCoins") {
          return "notEnoughRushCoins";
        }
        return false;
      }
    },
  },
});
