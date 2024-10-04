import { defineStore } from "pinia";
interface State {
  firstName: string;
  lastName: string;
  userId: number | null;
}

export const useStore = defineStore("store", {
  state: (): State => ({
    firstName: "",
    lastName: "",
    userId: null,
  }),
  getters: {
    fullName: (state) => `${state.firstName} ${state.lastName}`,
    loggedIn: (state) => state.userId !== null,
  },
  actions: {
    updateUser(payload: State) {
      this.firstName = payload.firstName;
      this.lastName = payload.lastName;
      this.userId = payload.userId;
    },
    clearUser() {
      this.$reset();
    },
  },
});
