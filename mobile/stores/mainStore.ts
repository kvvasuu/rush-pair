import i18n from "@/locales/i18n";
import { getLocales } from "expo-localization";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Language, Theme } from "@/utils/types";

type MainStore = {
  loading: boolean;
  error: string | null;

  language: Language;
  setLanguage: (code: Language) => void;

  theme: Theme;
  setTheme: (theme: Theme) => void;
};

export const useMainStore = create<MainStore>()(
  persist(
    (set, get) => ({
      loading: false,
      error: null as string | null,

      language: (getLocales()[0].languageCode ?? "en") as Language,
      setLanguage: async (code) => {
        i18n.locale = code;
        set({ language: code });
      },

      theme: "system",
      setTheme: (theme) => {
        set({ theme });
      },
    }),
    {
      name: "rushpair",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        language: state.language,
        theme: state.theme,
      }),
    }
  )
);
