import i18n from "@/locales/i18n";
import { getLocales } from "expo-localization";
import { create } from "zustand";
import { fetch } from "expo/fetch";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Language, Theme } from "@/utils/types";

type useMainStore = {
  language: Language;
  setLanguage: (code: Language) => void;

  theme: Theme;
  setTheme: (theme: Theme) => void;

  loading: boolean;
  error: string | null;
};

export const useMainStore = create<useMainStore>()(
  persist(
    (set, get) => ({
      language: (getLocales()[0].languageCode ?? "en") as Language,
      setLanguage: async (code) => {
        i18n.locale = code;
        set({ language: code });
      },

      theme: "system",
      setTheme: (theme) => {
        set({ theme });
      },

      products: [],
      fetchProducts: async () => {
        if (get().loading) return;

        set({ loading: true });

        try {
          const apiUrlStart = "https://radaway.";

          let domain = i18n.locale;

          if (domain === "en") {
            domain = "eu";
          }

          const apiUrl = `${apiUrlStart}${domain}/wp-json/rapp/v3/models/`;

          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 30000);

          const response = await fetch(apiUrl, { signal: controller.signal });
          clearTimeout(timeout);

          if (!response.ok) throw new Error("Błąd pobierania");
          const data = await response.json();

          set({
            loading: false,
            error: null,
          });
        } catch (err) {
          console.warn("Używam cache zamiast API");
          set({
            error: (err as Error).message || "network_error",
            loading: false,
          });
        }
      },

      lastUpdated: null,
      loading: false,
      error: null as string | null,
    }),
    {
      name: "showerar",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        language: state.language,
        theme: state.theme,
      }),
    }
  )
);
