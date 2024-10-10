import { defineStore } from "pinia";
interface State {
  name: string;
  email: string | null;
  token: string;
}

export const useMainStore = defineStore("mainStore", {
  state: (): State => ({
    name: "",
    email: null,
    token: "",
  }),
  actions: {
    updateUser(payload: State) {
      this.name = payload?.name || "";
      this.email = payload.email;
    },
  },
});
