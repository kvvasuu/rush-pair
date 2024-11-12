import { defineStore } from "pinia";
import { ChatStoreState } from "../types";
import { useUserStore } from "./userStore";
import axios from "axios";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

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
      const userStore = useUserStore();

      const pair = userStore.pairs.filter((pair) => pair.id === id)[0];

      try {
        const res = await axios.get(`${SERVER_URL}/user/get-pair-chat/${id}`, {
          headers: {
            Authorization: `Bearer ${userStore.token}`,
            isVisible: pair.isVisible,
          },
        });
      } catch (error) {
        console.log(error);
      }
    },
    closeChat() {
      this.$reset();
    },
  },
});
