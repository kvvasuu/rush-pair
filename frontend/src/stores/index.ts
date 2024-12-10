import { defineStore } from "pinia";
interface State {
  isLoading: boolean;
  isDrawing: boolean;
}

export const useMainStore = defineStore("mainStore", {
  state: (): State => ({
    isLoading: false,
    isDrawing: false,
  }),
});
