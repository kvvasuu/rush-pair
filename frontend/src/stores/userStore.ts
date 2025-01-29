import { defineStore } from "pinia";
import axios from "axios";
import { User, UserStoreState, availableLanguages } from "../types";
import { useMainStore } from ".";
import { io } from "socket.io-client";
import { changeLocale } from "../locales/i18n";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

export const socket = io(SERVER_URL, { autoConnect: false });

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
      language: "en",
    },
    pairs: [],
    rushCoins: 0,
  }),
  getters: {
    getAllUnreadMessages(): number {
      return this.pairs.reduce((a, b) => a + b.unreadMessagesCount, 0);
    },
  },
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
          const res = await axios.get("/auth/verify-token", { timeout: 10000 });

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
            rushCoins,
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
          this.rushCoins = rushCoins || 0;
          try {
            this.getPairs();
          } catch (error) {
            console.log(error);
          }

          socket.connect();
          socket.emit("login", this.id);
          this.bindEvents();

          this.router.replace("/app");
          if (res.data.coinsCollected) {
          }
          setTimeout(() => {
            const mainStore = useMainStore();
            mainStore.showCoinsCollectionModal = true;
          }, 500);
        } catch (error) {
          localStorage.removeItem("token");
        }
      }
    },
    async logout() {
      localStorage.removeItem("token");
      socket.emit("logout");
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
    async changeLanguage(language: availableLanguages) {
      await this.changeSettings({ language });
      changeLocale(language);
    },
    async getPairs() {
      if (this.token) {
        try {
          const res = await axios.get("/chat/get-pairs");
          this.pairs = res.data.pairedWith || [];
        } catch (error) {}
      }
    },
    bindPairingEvents() {
      const mainStore = useMainStore();

      if (!socket.hasListeners("joinedPairing")) {
        socket.on("joinedPairing", (data) => {
          mainStore.socketMessage = data.message;
        });
      }
      if (!socket.hasListeners("emptyQueue")) {
        socket.on("emptyQueue", (data) => {
          mainStore.socketMessage = data.message;
          mainStore.isEmpty = true;
        });
      }
      if (!socket.hasListeners("leftPairing")) {
        socket.on("leftPairing", (data) => {
          mainStore.socketMessage = data.message;
        });
      }
      if (!socket.hasListeners("paired")) {
        socket.on("paired", (data) => {
          mainStore.pairId = data.pairId;
          mainStore.socketMessage = data.message;
        });
      }
    },
    bindEvents() {
      if (!socket.hasListeners("getMessage")) {
        socket.on("getMessage", (sender) => {
          const pairIndex = this.pairs.findIndex((pair) => pair.id === sender);
          this.pairs[pairIndex].unreadMessagesCount++;
        });
      }
    },
    removeEvents() {
      socket.removeAllListeners("joinedPairing");
      socket.removeAllListeners("emptyQueue");
      socket.removeAllListeners("leftPairing");
      socket.removeAllListeners("paired");
    },
    async startDrawingAPair() {
      this.bindPairingEvents();
      socket.emit("startPairing", this.id);
    },
    async stopDrawingAPair() {
      socket.emit("stopPairing", this.id);
      this.removeEvents();
      const mainStore = useMainStore();
      mainStore.socketMessage = "";
      mainStore.isEmpty = false;
      mainStore.pairId = "";
    },
  },
});
