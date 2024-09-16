import en from "@feathr/shared/i18n/en.json";
import de from "@feathr/shared/i18n/de.json";
import {invoke} from "@tauri-apps/api/core";
import {addMessages, init, locale} from "svelte-i18n";
import {writable} from "svelte/store";
import app from "@feathr/shared/js/core/app.js";

export const i18nReady = writable(false);

export class I18n {
  constructor() {
    addMessages("en-US", en);
    addMessages("de-DE", de);

    init({
      initialLocale: "en-US",
      fallbackLocale: "en-US",
    });
  }
  
  async init() {
    let storedLang = localStorage.getItem("language");
    let initLang = storedLang ? JSON.parse(storedLang) : await invoke("fetch_locale");
    
    app.settings.language.set(initLang);
  }

  setLanguage = (lang) => {
    locale.set(lang);
    i18nReady.set(true);
  }
}
