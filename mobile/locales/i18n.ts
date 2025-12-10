import { Language } from "@/utils/types";
import { I18n } from "i18n-js";
import en from "./en.json";
import pl from "./pl.json";

const i18n = new I18n({
  pl,
  en,
});

i18n.defaultLocale = "en";
i18n.enableFallback = true;

async function loadTranslations(locale: Language) {
  const response = await fetch(`/${locale}.json`);
  const translations = await response.json();

  i18n.store(translations);
}

export default i18n;
export { loadTranslations };
