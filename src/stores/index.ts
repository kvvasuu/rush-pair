import { defineStore } from "pinia";

type PlayerType = "admin" | "user";
interface State {
  name: string;
  userId: string | null;
  isPlaying: boolean;
  playerType: PlayerType;
  isConnected: boolean | null;
  roomName: string;
}

export const useMainStore = defineStore("mainStore", {
  state: (): State => ({
    name: "",
    userId: null,
    isPlaying: false,
    playerType: "user",
    isConnected: null,
    roomName: "",
  }),
  actions: {
    updateUser(payload: State) {
      this.name = payload?.name || "";
      this.userId = payload.userId;
    },
    setRoomName(payload: string) {
      this.roomName = payload;
    },
    setGameMode(payload: PlayerType) {
      this.playerType = payload;
    },
    setUserId(payload: string) {
      this.userId = payload;
    },
    setConnectionState(payload: boolean) {
      this.isConnected = payload;
    },
    resetGame() {
      this.$reset();
    },
  },
});
