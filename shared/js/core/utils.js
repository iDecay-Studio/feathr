import app from "@leaf/shared/js/core/app.js";
import {eol} from "@tauri-apps/plugin-os";
import {open as openWithDefault} from "@tauri-apps/plugin-shell";

export const inApp = window.__TAURI__ ?? false;
export const EOL = inApp ? eol() : /\r*\n/g;

export const clamp = (v, min, max) => v < min ? min : v > max ? max : v;

export const exec = (cmd, val = null, focus = true) => {
  if (focus) app.editor.focus()
  document.execCommand(cmd, false, val);
};

export const openLink = (link) => {
  if (inApp) openWithDefault(link);
  else window.open(link);
}

export const getFileNameFromPath = (filePath) => {
  if (!filePath) return "";
  
  const parts = filePath.replace(/\\/g, '/').split('/');
  return parts[parts.length - 1];
  //alt.: return filePath.replace(/^.*([\\/:])/, "");
}

//returns x, y coordinates for absolute positioning of a span within a given text input at a given selection point
export const getCaretXY = (input, selectionPoint) => {
  const {offsetLeft: inputX, offsetTop: inputY} = input;
  const div = document.createElement('div');
  const span = document.createElement('span');

  const copyStyle = getComputedStyle(input);
  for (const prop of copyStyle) div.style[prop] = copyStyle[prop];
  div.style.height = 'auto';

  div.textContent = input.value.substring(0, selectionPoint);
  span.textContent = input.value.substring(selectionPoint) || '.';

  div.appendChild(span);
  document.body.appendChild(div);

  const {offsetLeft: spanX, offsetTop: spanY} = span;
  document.body.removeChild(div);

  return {x: inputX + spanX, y: inputY + spanY};
};

// #copyStyles(src, dest, copyStyles) {
//   let styles = window.getComputedStyle(src);
//   copyStyles.forEach((stl) => dest.style[stl] = styles[stl]);
// }