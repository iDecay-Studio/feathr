import {get, writable} from "svelte/store";
import {clamp} from "@/utils/core/utils.js";

export class Settings {
  autoIndent = new Setting('auto-indent', true);
  showSidebar = new Setting('show-sidebar', true);
  focusMode = new Setting('focus-mode', false);
  wordWrap = new Setting('word-wrap', true);
  fontType = new Setting('font-type', 'sans');
  fontSize = new FontSize();

  #prefersDarkTheme = window.matchMedia('(prefers-color-scheme: dark)').matches === true;
  theme = new Setting('theme', this.#prefersDarkTheme ? "dark" : "light", (val) => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(val);
  });
}

class Setting {
  constructor(key, def, onChange = null) {
    this.key = key;
    this.def = def;
    this.store = writable(def);
    this.onChange = onChange;

    this.set(this.#get(this.key, this.def));
  }

  get = () => !get(this.store);
  set = (value) => this.#set(this.key, this.store, value, this.onChange);
  toggle = () => this.set(!this.get());
  reset = () => this.set(this.def);

  #get = (key, defVal) => localStorage.getItem(key) || defVal;
  #set = (key, store, val, action) => {
    store.set(val);
    localStorage.setItem(key, val);
    action && action(val);
  };
}

class FontSize extends Setting {
  constructor() {
    super('font-size', 16);
  }

  #increaseBy = 2;
  increase = () => this.#set(this.get() + this.#increaseBy);
  decrease = () => this.#set(this.get() - this.#increaseBy);
  #set = (value) => this.set(clamp(value, 6, 32));
}