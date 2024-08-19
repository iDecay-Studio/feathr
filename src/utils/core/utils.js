import {app} from "@/utils/core/app.js";
import {eol} from "@tauri-apps/plugin-os";

export const inApp = window.__TAURI__;
export const EOL = inApp ? eol() : /\r*\n/;

export const clamp = (v, min, max) => v < min ? min : v > max ? max : v;
// export const getFileNameFromPath = (filePath) => filePath.replace(/^.*(\\|\/|\:)/, "");

export const exec = (cmd, val = null, focus = true) => {
  if (focus) app.editor.el.focus();
  document.execCommand(cmd, false, val);
};

export function isJSON(text) {
  try {
    JSON.parse(text);
    return true;
  } catch (error) {
    return false;
  }
}