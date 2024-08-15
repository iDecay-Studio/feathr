import {closeApp, closeFile, saveFile, saveFileAs, discardChanges, newFile, openFile, openInExplorer} from "@/utils/editor.js";
import {undo, redo, find, replace, copy, cut, paste} from "@/utils/menu.js";
import {focusMode, fontSize, incrFontSizeBy, setFocusMode, setFontSize} from "@/utils/settings.js";
import {get} from "svelte/store";

//maybe use the Tauri globalShortcut module instead, but I don't see any advantage over the native JS approach (https://tauri.app/v1/api/js/globalshortcut/)
const checkKey = (evt, key) => evt.key.toLowerCase() === key;
const checkShortcut = (evt, key) => (evt.ctrlKey || evt.metaKey) && checkKey(evt, key);

const onKeyDown = async (evt) => {
  if (evt.repeat) return;

  //file
  if (checkKey(evt, "n")) newFile();
  if (checkKey(evt, "o")) openFile();
  if (checkKey(evt, "e")) openInExplorer();
  if (checkKey(evt, "s")) saveFile();
  if (checkShortcut(evt, "s")) saveFileAs();
  if (checkShortcut(evt, "c")) discardChanges();
  if (checkKey(evt, "w")) closeFile();
  if (checkKey(evt, "q")) closeApp();

  //edit
  if (checkKey(evt, "z")) undo();
  if (checkKey(evt, "y")) redo();
  if (checkKey(evt, "f")) find();
  if (checkKey(evt, "r")) replace();
  if (checkKey(evt, "x")) cut();
  if (checkKey(evt, "c")) copy();
  if (checkKey(evt, "v")) paste();
  
  //view
  if (checkKey(evt, "enter")) setFocusMode(!get(focusMode));
  if (checkKey(evt, "+")) setFontSize(get(fontSize) + incrFontSizeBy);
  if (checkKey(evt, "-")) setFontSize(get(fontSize) - incrFontSizeBy);
  
  //general
  if (checkKey(evt, "escape")) await onEscape();
}

const onEscape = () => {
  if (get(focusMode)) setFocusMode(false);
}

window.addEventListener('keydown', onKeyDown);