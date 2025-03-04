import { defineStore } from "pinia";
import axios from "axios";
import { GameStoreState } from "../types";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

export const useGameStore = defineStore("gameStore", {
  state: (): GameStoreState => ({
    gameId: "",
    gameName: "",
    players: [],
    status: null,
    createdAt: 0,
    createdBy: "",
    gameData: {},
    score: 0,
  }),
  actions: {
    async getGameData(
      gameId: string,
      gameName: string,
      playerId: string
    ): Promise<boolean> {
      try {
        const game = await axios.get(
          `${SERVER_URL}/games/${gameName}/${gameId}?playerId=${playerId}`
        );

        if (game) {
          const { players, createdAt, gameData, score, createdBy } = {
            ...game.data,
          };

          const playerStatus = players.find(
            (player: { player: string; status: string }) =>
              player.player === playerId
          )?.status;

          this.gameId = gameId;
          this.gameName = gameName;
          this.players = players;
          this.status = playerStatus;
          this.createdAt = createdAt;
          this.createdBy = createdBy;
          this.gameData = gameData;
          this.score = score;

          return false;
        }
        return true;
      } catch (error: any) {
        if (error.response && error.response.status === 404) {
          console.log(error.response);
          try {
            const newGame = await axios.post(
              `${SERVER_URL}/games/${gameName}`,
              {
                gameId,
              }
            );

            if (newGame) {
              await this.getGameData(gameId, gameName, playerId);
            }
          } catch (postError) {
            console.error(postError);
          }
        } else {
          console.error(error);
        }

        return false;
      }
    },
    closeGame() {
      this.$reset();
    },
  },
});
