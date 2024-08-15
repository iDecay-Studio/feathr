import {discardChanges, newFile} from "@/utils/editor.js";

const closeWindow = () => {}
const onEscape = () => {
  // if (isFullscreen) toggleFullscreen();
}

//maybe use the Tauri globalShortcut module instead, but I don't see any advantage over the native JS approach (https://tauri.app/v1/api/js/globalshortcut/)
const checkKey = (evt, key) => evt.key.toLowerCase() === key;
const checkShortcut = (evt, key) => (evt.ctrlKey || evt.metaKey) && checkKey(evt, key);

const onKeyDown = async (evt) => {
  if (evt.repeat) return;

  //file
  if (checkKey(evt, "n")) newFile();
  if (checkShortcut(evt, "c")) discardChanges();
  if (checkShortcut(evt, "w")) closeWindow();

  //edit
  // if (checkKey(evt, "r")) findReplace();
  
  //view
  
  
  //general
  if (checkKey(evt, "escape")) await onEscape();
}

window.addEventListener('keydown', onKeyDown);