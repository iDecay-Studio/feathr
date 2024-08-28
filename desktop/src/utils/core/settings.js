import {get, writable} from "svelte/store";
import {clamp} from "@desktop/utils/core/utils.js";
import {app} from "@desktop/utils/core/app.js";

export class Settings {
  caseSensitive = new Setting('case-sensitive', false);
  matchWords = new Setting('match-words', false);
  showSidebar = new Setting('show-sidebar', true);
  autoIndent = new Setting('auto-indent', true);
  wordWrap = new Setting('word-wrap', true);
  fontType = new Setting('font-type', 'sans');
  fontSize = new FontSize();
  
  focusMode = new Setting('focus-mode', false, async (val, init) => {
    if (!init) await app.setFocusMode(val);
  });

  theme = new Setting('theme', "system", (val) => {
    if (val === "system") {
      let prefersDarkTheme = window.matchMedia('(prefers-color-scheme: dark)').matches === true;
      val = prefersDarkTheme ? "cappuccino" : "dimmed";
    }
    
    document.documentElement.className = `theme theme-${val}`;
  });
  
  init() {
    this.focusMode.set(false);
  }
}

class Setting {
  constructor(key, def, onChange = null) {
    this.key = key;
    this.def = def;
    this.store = writable(def);
    this.onChange = onChange;
    this.set(this.#get(), true);
  }

  set = (val, isInit = false) => {
    this.store.set(val);
    localStorage.setItem(this.key, JSON.stringify(val));
    this.onChange && this.onChange(val, isInit);
  };
  #get = () => {
    let storedVal = localStorage.getItem(this.key);
    return storedVal ? JSON.parse(storedVal) : this.def;
  }

  storeVal = () => get(this.store);
  toggle = () => this.set(!this.storeVal());
  reset = () => this.set(this.def);
}

class FontSize extends Setting {
  constructor() {
    super('font-size', 18, (val, isInit) => {
      if (isInit) return;
      app.editor.highlighter.onInput();
    });
  }

  #increaseBy = 2;
  increase = () => this.#set(this.storeVal() + this.#increaseBy);
  decrease = () => this.#set(this.storeVal() - this.#increaseBy);
  #set = (value) => this.set(clamp(value, 12, 32));
}