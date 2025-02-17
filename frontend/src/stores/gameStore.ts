import { defineStore } from "pinia";
import axios from "axios";
import { GameStoreState } from "../types";
import { useUserStore } from "./userStore";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

export const useGameStore = defineStore("gameStore", {
  state: (): GameStoreState => ({
    gameName: "",
    opponentId: "",
    status: null,
    createdAt: 0,
    gameData: {},
  }),
  actions: {
    async getGameData(gameId: string): Promise<boolean> {
      const userStore = useUserStore();
      try {
        const gameData = await axios.get(
          `${SERVER_URL}/games/quiz/${gameId}?userId=${userStore.id}`
        );
        console.log(gameData);
        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    },
  },
});
