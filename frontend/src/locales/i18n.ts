import { createI18n } from "vue-i18n";
import { availableLanguages } from "../types";

const allMessages = import.meta.glob<{ default: Record<string, string> }>(
  "./*/*.json"
);

const loadLocaleMessages = async (): Promise<void> => {
  const languages: Record<string, string[]> = {};

  for (const path in allMessages) {
    const locale = path.match(/\/([a-z]{2})\//i)?.[1];
    if (locale) {
      if (!languages[locale]) {
        languages[locale] = [];
      }
      languages[locale].push(path);
    }
  }

  for (const locale in languages) {
    const localeMessages: Record<string, any> = {};

    for (const path of languages[locale]) {
      const fileName = path.split("/").pop()?.replace(".json", "") || "default";
      const module = await allMessages[path]();

      if (fileName) {
        localeMessages[fileName] = localeMessages[fileName] || {};
        Object.assign(localeMessages[fileName], module.default);
      }
    }

    i18n.global.setLocaleMessage(locale, localeMessages);
  }
};

const changeLocale = (newLocale: availableLanguages) => {
  i18n.global.locale.value = newLocale;
};

const i18nConfig = {
  legacy: false,
  locale: "pl",
  fallbackLocale: "en",
  messages: {},
};

const i18n = createI18n(i18nConfig);

export { loadLocaleMessages, i18n, changeLocale, i18nConfig };
