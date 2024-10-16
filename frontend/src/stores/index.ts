import { defineStore } from "pinia";
interface State {
  isLoading: boolean;
}

export const useMainStore = defineStore("mainStore", {
  state: (): State => ({
    isLoading: false,
  }),
});
