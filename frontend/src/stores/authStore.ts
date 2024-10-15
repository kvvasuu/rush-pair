import { defineStore } from "pinia";
import axios from "axios";
import { User, authStoreState } from "../types";

export const useAuthStore = defineStore("authStore", {
  state: (): authStoreState => ({
    email: "",
    token: "",
    name: "",
    age: 16,
    gender: "other",
    country: "",
    city: "",
    phoneNumber: "",
    firstVisit: true,
    imageUrl: "",
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

          const { email, name, firstVisit } = { ...res.data.user };

          this.name = name;
          this.email = email;
          this.firstVisit = firstVisit;
          this.router.replace("/app");
        } catch (error) {
          localStorage.removeItem("token");
        }
      }
    },
    async logout() {
      localStorage.removeItem("token");
      this.$reset();
      this.router.replace("/");
    },
    async initializeUser(userData: User) {
      try {
        return await axios
          .put(
            "http://localhost:3000/user/update-profile",
            {
              email: this.email,
              userData: userData,
            },
            {
              headers: {
                Authorization: `Bearer ${this.token}`,
                "Content-Type": "application/json",
              },
            }
          )
          .then((res) => {
            this.name = res.data.user.name;
            this.age = res.data.user.age;
            this.gender = res.data.user.gender;
            this.country = res.data.user.country;
            this.city = res.data.user.city;
            this.phoneNumber = res.data.user.phoneNumber;
            this.firstVisit = res.data.user.firstVisit;
            this.router.replace("/app");
            return "User initialized";
          });
      } catch (_error) {
        throw new Error("Something went wrong. Try again later.");
      }
    },
  },
});
