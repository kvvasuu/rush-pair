import { defineStore } from "pinia";
import { Player } from "../types";

interface State {
  roomId: string;
  roomName: string;
  playersInRoom: Player[];
}

export const useAdminStore = defineStore("adminStore", {
  state: (): State => ({
    roomId: "",
    roomName: "",
    playersInRoom: [],
  }),
  getters: {
    getPlayersInRoom: (state) => state.playersInRoom,
  },
  actions: {
    setRoom(payload: { roomId: string; roomName: string }) {
      this.roomId = payload.roomId;
      this.roomName = payload.roomName;
    },
    addPlayer(payload: Player) {
      this.playersInRoom.push(payload);
    },
    removePlayer(payload: string) {
      this.playersInRoom = this.playersInRoom.filter(
        (el) => el.userId !== payload
      );
    },
    closeRoom() {
      this.roomId = "";
      this.roomName = "";
      this.playersInRoom = [];
    },
  },
});
