import {textEditor} from "./editor";

export const setFontStyle = (style = "sans") => {
  textEditor.classList.remove("font-sans font-serif font-mono");
  textEditor.classList.add(`font-${style}`);
}

export const setTheme = (theme = "dark") => {
  const html = document.querySelector("html");
  html.classList.remove("dark");
  if (theme === "dark") html.classList.add("dark");
}