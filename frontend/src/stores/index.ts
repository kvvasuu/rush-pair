import { defineStore } from "pinia";
import { MainStoreState } from "../types";

export const useMainStore = defineStore("mainStore", {
  state: (): MainStoreState => ({
    isLoading: false,
    isDrawing: false,
    isEmpty: false,
    pairId: "",
    socketMessage: "",
    showCoinsCollectionModal: false,
    showBlockedPairs: "",
  }),
});
