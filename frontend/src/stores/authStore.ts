import { defineStore } from "pinia";
import axios from "axios";

interface State {
  name: string;
  email: string;
  token: string;
}

export const useAuthStore = defineStore("authStore", {
  state: (): State => ({
    name: "",
    email: "",
    token: "",
  }),
  actions: {
    updateUser({ name, email }: { name: string; email: string }) {
      this.name = name || "";
      this.email = email;
    },
    setToken(token: string) {
      this.token = token;
      localStorage.setItem("token", token);
    },
    async login() {
      let token: string | null = this.token;
      if (!token) {
        token = localStorage.getItem("token");
      }

      if (token) {
        try {
          const res = await axios.get(
            "http://localhost:3000/auth/verify-token",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          this.setToken(token);

          const { email, name } = { ...res.data.user };
          this.updateUser({ name, email });
          this.router.replace("/app");
        } catch (error) {
          localStorage.removeItem("token");
        }
      }
    },
  },
});
