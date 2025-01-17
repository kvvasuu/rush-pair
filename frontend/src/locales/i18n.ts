import { createI18n } from "vue-i18n";
import en from "./en/welcomeScreen.json";
import pl from "./pl/welcomeScreen.json";

const i18nConfig = {
  legacy: false,
  locale: "pl",
  fallbackLocale: "pl",
  messages: {
    en: en,
    pl: pl,
  },
};

const i18n = createI18n(i18nConfig);

export default i18n;
