import {closeFile, saveFile, saveFileAs, discardChanges, newFile, openFile, openInExplorer} from "@/utils/editor/file.js";
import {undo, redo, find, replace, copy, cut, paste, gotoPrevMarker, gotoLine, gotoNextMarker, gotoPrevFile, gotoNextFile, selectAutocomplete, selectSynonym} from "@/utils/ui/menu.js";
import app from "@/utils/core/app.js";

//maybe use the Tauri globalShortcut module instead, but I don't see any advantage over the native JS approach (https://tauri.app/v1/api/js/globalshortcut/)
const checkKey = (e, key) => e.key.toLowerCase() === key;
const checkCtrl = (e, key) => (e.ctrlKey || e.metaKey) && checkKey(e, key);
const checkShift = (e, key) => e.shiftKey && checkKey(e, key);
const checkCtrlShift = (e, key) => e.shiftKey && checkCtrl(e, key);

export function handleShortcuts(e) {
  if (e.repeat) return;

  //general
  if (checkKey(e, "escape")) app.settings.focusMode.set(false);

  //file
  if (checkCtrl(e, "n")) newFile();
  if (checkCtrl(e, "o")) openFile();
  if (checkCtrl(e, "e")) openInExplorer();
  if (checkCtrl(e, "s")) saveFile();
  if (checkCtrlShift(e, "s")) saveFileAs();
  if (checkCtrlShift(e, "c")) discardChanges();
  if (checkCtrl(e, "w")) closeFile();
  if (checkCtrl(e, "q")) app.quit();

  //edit
  if (checkCtrl(e, "z")) undo();
  if (checkCtrl(e, "y")) redo();
  if (checkCtrl(e, "f")) find();
  if (checkCtrl(e, "r")) replace();
  if (checkCtrl(e, "x")) cut();
  if (checkCtrl(e, "c")) copy();
  if (checkCtrl(e, "v")) paste();
  if (checkKey(e, "tab")) selectAutocomplete();
  if (checkShift(e, "tab")) selectSynonym();

  //go to
  if (checkCtrl(e, "g")) gotoLine();
  if (checkCtrl(e, "up")) gotoPrevMarker();
  if (checkCtrl(e, "down")) gotoNextMarker();
  if (checkCtrl(e, "left")) gotoPrevFile();
  if (checkCtrl(e, "right")) gotoNextFile();
  
  //view
  if (checkCtrl(e, "tab")) app.settings.showSidebar.toggle();
  if (checkCtrl(e, "enter")) app.settings.focusMode.toggle();
  if (checkCtrl(e, "+")) app.settings.fontSize.increase();
  if (checkCtrl(e, "-")) app.settings.fontSize.decrease();
}