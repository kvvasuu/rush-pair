import { defineStore } from "pinia";
interface State {
  isLoading: boolean;
}

export const useMainStore = defineStore("mainStore", {
  state: (): State => ({
    isLoading: true,
  }),
  actions: {
    setLoading() {
      this.isLoading = !this.isLoading;
    },
  },
});
