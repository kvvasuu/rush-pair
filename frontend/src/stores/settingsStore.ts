import { defineStore } from "pinia";
import axios from "axios";
import { settingsStoreState } from "../types";
import { useAuthStore } from "./authStore";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

export const useSettingsStore = defineStore("settingsStore", {
  state: (): settingsStoreState => ({
    settings: {
      notifications: true,
      theme: "dark",
      language: "ENG",
    },
  }),
  actions: {
    async changeSettings(settings: {}) {
      const authStore = useAuthStore();
      if (authStore.token) {
        try {
          await axios.patch(
            `${SERVER_URL}/user/change-settings`,
            { email: authStore.email, settings },
            {
              headers: {
                Authorization: `Bearer ${authStore.token}`,
              },
            }
          );
          this.settings = { ...this.settings, ...settings };
        } catch (error) {
          throw error;
        }
      }
    },
  },
});
