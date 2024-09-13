import app from "@feathr/shared/js/core/app.js";
import {eol, platform} from "@tauri-apps/plugin-os";
import {open as openWithDefault} from "@tauri-apps/plugin-shell";

export const inApp = window.__TAURI__ ?? false;
export const isMobile = inApp && ['android','ios'].indexOf(platform()) !== -1;

export const EOL = /\r*\n/g;
export const rawEOL = inApp ? eol() : "\r\n";

export const clamp = (v, min, max) => v < min ? min : v > max ? max : v;
export const shuffle = (array) => array.sort(() => Math.random() - 0.5);

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
  document.getElementById('container').appendChild(div);

  const {offsetLeft: spanX, offsetTop: spanY} = span;
  document.getElementById('container').removeChild(div);

  return {x: inputX + spanX, y: inputY + spanY};
};

// #copyStyles(src, dest, copyStyles) {
//   let styles = getComputedStyle(src);
//   copyStyles.forEach((stl) => dest.style[stl] = styles[stl]);
// }