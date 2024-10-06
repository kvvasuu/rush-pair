import { defineStore } from "pinia";
import { Player } from "../types";

interface State {
  roomName: string;
  playersInRoom: Player[];
}

export const useAdminStore = defineStore("adminStore", {
  state: (): State => ({
    roomName: "",
    playersInRoom: [],
  }),
  getters: {
    getPlayersInRoom: (state) => state.playersInRoom,
  },
  actions: {
    setRoomName(payload: string) {
      this.roomName = payload;
    },
    addPlayer(payload: Player) {
      this.playersInRoom.push(payload);
    },
    removePlayer(payload: string) {
      console.log(this.playersInRoom);
      this.playersInRoom = this.playersInRoom.filter(
        (el) => el.userId !== payload
      );
      console.log(this.playersInRoom);
    },
    closeRoom() {
      this.roomName = "";
      this.playersInRoom = [];
    },
  },
});
