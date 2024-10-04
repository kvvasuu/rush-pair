import { defineStore } from "pinia";

type PlayerType = "admin" | "user";
interface State {
  firstName: string;
  lastName: string;
  userId: number | null;
  isPlaying: boolean;
  playerType: PlayerType;
}

export const useMainStore = defineStore("mainStore", {
  state: (): State => ({
    firstName: "",
    lastName: "",
    userId: null,
    isPlaying: false,
    playerType: "user",
  }),
  getters: {
    fullName: (state) => `${state.firstName} ${state.lastName}`,
    loggedIn: (state) => state.userId !== null,
  },
  actions: {
    updateUser(payload: State) {
      this.firstName = payload?.firstName || "";
      this.lastName = payload?.lastName || "";
      this.userId = payload.userId;
    },
    setGameMode(payload: PlayerType) {
      this.playerType = payload;
    },
    setUserId(payload: number) {
      this.userId = payload;
    },
    resetGame() {
      this.$reset();
    },
  },
});
