import { defineStore } from "pinia";
import axios from "axios";
import { User, UserStoreState } from "../types";
import { useMainStore } from ".";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

export const useUserStore = defineStore("userStore", {
  state: (): UserStoreState => ({
    email: "",
    token: "",
    name: "",
    birthdate: "",
    gender: "other",
    country: "",
    city: "",
    phoneNumber: "",
    firstVisit: true,
    imageUrl: "",
    description: "",
    settings: {
      notifications: true,
      theme: "light",
      language: "ENG",
    },
    pairs: [],
  }),
  actions: {
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
          const res = await axios.get(`${SERVER_URL}/auth/verify-token`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          this.setToken(token);
          const {
            email,
            name,
            birthdate,
            gender,
            country,
            city,
            firstVisit,
            phoneNumber,
            imageUrl,
            settings,
            description,
          } = { ...res.data.user };

          this.name = name || "";
          this.email = email;
          this.firstVisit = firstVisit;
          this.birthdate = birthdate || "";
          this.gender = gender || "other";
          this.country = country || "";
          this.city = city || "";
          this.phoneNumber = phoneNumber || "";
          this.imageUrl = imageUrl || "";
          this.settings = settings || this.settings;
          this.description = description || "";
          try {
            this.getPairs();
          } catch (error) {
            console.log(error);
          }
          this.router.replace("/app");
        } catch (error) {
          localStorage.removeItem("token");
        }
      }
    },
    async logout() {
      localStorage.removeItem("token");
      const store = useMainStore();
      store.$reset();
      document.documentElement.setAttribute("data-theme", "light");
      this.$reset();
      this.router.replace("/");
    },
    async updateUser(user: User) {
      const mainStore = useMainStore();

      mainStore.isLoading = true;

      return new Promise((resolve, reject) => {
        axios
          .put(
            `${SERVER_URL}/user/update-profile`,
            {
              email: this.email,
              userData: user,
            },
            {
              headers: {
                Authorization: `Bearer ${this.token}`,
              },
            }
          )
          .then((res) => {
            this.name = res.data.user.name;
            this.birthdate = res.data.user.birthdate;
            this.gender = res.data.user.gender;
            this.country = res.data.user.country;
            this.city = res.data.user.city;
            this.phoneNumber = res.data.user.phoneNumber;
            this.imageUrl = res.data.user.imageUrl;
            this.firstVisit = res.data.user.firstVisit;
            this.description = res.data.user.description;
            resolve("Details updated");
          })
          .catch((err) => {
            reject(err);
          })
          .finally(() => {
            mainStore.isLoading = false;
          });
      });
    },
    async changeSettings(settings: {}) {
      if (this.token) {
        try {
          await axios.patch(
            `${SERVER_URL}/user/change-settings`,
            { settings },
            {
              headers: {
                Authorization: `Bearer ${this.token}`,
              },
            }
          );
          this.settings = { ...this.settings, ...settings };
        } catch (error) {
          throw error;
        }
      }
    },
    async getPairs() {
      if (this.token) {
        try {
          const res = await axios.get(`${SERVER_URL}/user/get-pairs`, {
            headers: {
              Authorization: `Bearer ${this.token}`,
            },
          });
          this.pairs = res.data.pairedWith || [];
        } catch (error) {}
      }
    },
  },
});
