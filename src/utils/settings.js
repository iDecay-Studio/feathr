import {writable} from "svelte/store";

export const defFocusMode = false;
export const defWordWrap = true;
export const defFontType = "sans";
export const defFontSize = 16;
export const incrFontSizeBy = 2;

export let focusMode = writable(defFocusMode);
export let wordWrap = writable(defWordWrap);
export let fontType = writable(defFontType);
export let fontSize = writable(defFontSize);
export let theme = writable("dark");

const get = (key, defVal) => localStorage.getItem(key) || defVal;
const set = (key, val, writable) => {
  writable.set(val);
  localStorage.setItem(key, val);
}

export function init() {
  setFocusMode(get("focus-mode", defWordWrap));
  setWordWrap(get("word-wrap", defWordWrap));
  setFontType(get("font-type", defFontType));
  setFontSize(get("font-size", defFontSize));
  
  let prefersDarkTheme = window.matchMedia('(prefers-color-scheme: dark)').matches === true;
  setTheme(get("theme", prefersDarkTheme ? "dark" : "light"));
}

export const setFocusMode = (value) => set("focus-mode", value, focusMode);
export const setWordWrap = (value) => set("word-wrap", value, wordWrap);
export const setFontType = (value) => set("font-type", value, fontType);
export const setFontSize = (value) => set("font-size", Math.max(Math.min(value, 6), 32), fontSize);

export const setTheme = (value) => {
  set("theme", value, theme);
  document.documentElement.classList.remove("light", "dark");
  document.documentElement.classList.add(value);
}