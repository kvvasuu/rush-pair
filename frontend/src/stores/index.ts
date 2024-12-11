import { defineStore } from "pinia";
interface State {
  isLoading: boolean;
  isDrawing: boolean;
  isEmpty: boolean;
  pairId: string;
  socketMessage: string;
}

export const useMainStore = defineStore("mainStore", {
  state: (): State => ({
    isLoading: false,
    isDrawing: false,
    isEmpty: false,
    pairId: "",
    socketMessage: "",
  }),
});
