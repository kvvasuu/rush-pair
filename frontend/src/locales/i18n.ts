import { createI18n } from "vue-i18n";
import { availableLanguages } from "../types";

const allMessages = import.meta.glob<{ default: Record<string, string> }>(
  "./*/*.json"
);

const loadLocaleMessages = async (
  locale: string,
  fallbackLocale: string = "en"
): Promise<Record<string, any>> => {
  const messages: Record<string, any> = {};

  const loadMessagesForLocale = async (localeToLoad: string) => {
    for (const path in allMessages) {
      if (path.includes(`/${localeToLoad}/`)) {
        const fileName = path.split("/").pop()?.replace(".json", "");
        const module = await allMessages[path]();

        if (fileName) {
          if (!messages[fileName]) {
            messages[fileName] = {};
          }
          Object.assign(messages[fileName], module.default);
        }
      }
    }
  };

  await loadMessagesForLocale(fallbackLocale);

  if (locale !== fallbackLocale) {
    await loadMessagesForLocale(locale);
  }

  return messages;
};

const changeLocale = (newLocale: availableLanguages) => {
  i18n.global.locale.value = newLocale;
  loadLocaleMessages(newLocale).then((messages) => {
    i18n.global.setLocaleMessage(newLocale, messages);
  });
};

const i18nConfig = {
  legacy: false,
  locale: "pl",
  fallbackLocale: "en",
  messages: {},
};

const i18n = createI18n(i18nConfig);

export { loadLocaleMessages, i18n, changeLocale, i18nConfig };
