import { defineStore } from "pinia";
import { ChatStoreState } from "../types";
import { useUserStore } from "./userStore";
/* import axios from "axios";

const SERVER_URL = import.meta.env.VITE_SERVER_URL; */

export const useChatStore = defineStore("chatStore", {
  state: (): ChatStoreState => ({
    pairInfo: {
      id: "",
      name: "",
      age: 16,
      gender: "other",
      pairedAt: 0,
      imageUrl: "",
      isVisible: false,
      city: "",
      description: "",
    },
  }),
  actions: {
    async openChat(id: string) {
      return new Promise((resolve, reject) => {
        const userStore = useUserStore();
        const pair = userStore.pairs.find((pair) => pair.id === id);
        if (pair) {
          this.pairInfo = { ...pair };
          resolve(true);
        } else {
          reject();
        }
      });
    },
    closeChat() {
      this.$reset();
    },
  },
});
