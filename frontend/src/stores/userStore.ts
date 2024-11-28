import { defineStore } from "pinia";
import axios from "axios";
import { User, UserStoreState } from "../types";
import { useMainStore } from ".";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

export const useUserStore = defineStore("userStore", {
  state: (): UserStoreState => ({
    id: "",
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
    initAxios() {
      axios.defaults.baseURL = SERVER_URL;
      axios.interceptors.request.use(
        (config) => {
          if (this.token) {
            config.headers.Authorization = `Bearer ${this.token}`;
          }
          return config;
        },
        (error) => {
          return Promise.reject(error);
        }
      );
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
        this.setToken(token);
        this.initAxios();
        try {
          const res = await axios.get("/auth/verify-token");

          const {
            _id,
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

          this.id = _id;
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
          .put("/user/update-profile", {
            email: this.email,
            userData: user,
          })
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
          await axios.patch("/user/change-settings", { settings });
          this.settings = { ...this.settings, ...settings };
        } catch (error) {
          throw error;
        }
      }
    },
    async getPairs() {
      if (this.token) {
        try {
          const res = await axios.get("/chat/get-pairs");
          this.pairs = res.data.pairedWith || [];
        } catch (error) {}
      }
    },
  },
});
