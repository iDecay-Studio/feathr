import {get, writable} from "svelte/store";
import {clamp} from "@/utils/core/utils.js";

export function Settings() {
  this.autoIndent = new Setting('auto-indent', true);
  this.showSidebar = new Setting('show-sidebar', true);
  this.focusMode = new Setting('focus-mode', false);
  this.wordWrap = new Setting('word-wrap', true);
  this.fontType = new Setting('font-type', 'sans');
  this.fontSize = new FontSize();

  let prefersDarkTheme = window.matchMedia('(prefers-color-scheme: dark)').matches === true;
  this.theme = new Setting('theme', prefersDarkTheme ? "dark" : "light", (val) => {
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

  set = (value) => super.set(clamp(value, 6, 32));
  increase = () => this.set(this.get() + this.#increaseBy);
  decrease = () => this.set(this.get() - this.#increaseBy);
  #increaseBy = 2;
}