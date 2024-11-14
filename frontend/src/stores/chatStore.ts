import { defineStore } from "pinia";
import { ChatStoreState } from "../types";
import { useUserStore } from "./userStore";
import axios from "axios";

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
    },
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
            pair.name = this.pairInfo.name;
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
  },
});
