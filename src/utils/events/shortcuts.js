import {app} from "@/utils/core/app.js";
import {
  copy,
  cut,
  find,
  gotoLine,
  gotoNextFile,
  gotoNextMarker,
  gotoPrevFile,
  gotoPrevMarker,
  paste,
  redo,
  replace,
  selectAutocomplete,
  selectSynonym,
  undo,
} from "@/utils/ui/menu.js";

//maybe use the Tauri globalShortcut module instead, but I don't see any advantage over the native JS approach (https://tauri.app/v1/api/js/globalshortcut/)
const checkKey = (e, key, prevDef = true) => e.key.toLowerCase() === key && (!prevDef || preventDef(e));
const checkCtrl = (e, key, prevDef = true) => (e.ctrlKey || e.metaKey) && checkKey(e, key) && (!prevDef || preventDef(e));
const checkShift = (e, key, prevDef = true) => e.shiftKey && checkKey(e, key, prevDef);
const checkCtrlShift = (e, key, prevDef = true) => e.shiftKey && checkCtrl(e, key, prevDef);
const preventDef = (e) => {e.preventDefault(); return true;};

export function handleShortcuts(e) {
  if (e.repeat) return;

  //general
  if (checkKey(e, "escape")) {
    app.settings.focusMode.set(false);
    app.cmdBar.close();
  }

  //file
  if (checkCtrl(e, "n")) app.project.newFile();
  if (checkCtrl(e, "o")) app.project.openFile();
  if (checkCtrl(e, "e")) app.project.openInExplorer();
  if (checkCtrl(e, "s")) app.project.save();
  if (checkCtrlShift(e, "s")) app.project.save_as();
  if (checkCtrl(e, "d")) app.project.discard();
  if (checkCtrl(e, "w")) app.project.close();
  if (checkCtrl(e, "q")) app.quit();

  //edit
  // if (checkCtrl(e, "z")) undo();
  // if (checkCtrl(e, "y")) redo();
  if (checkCtrl(e, "f")) find();
  if (checkCtrl(e, "r")) replace();
  // if (checkCtrl(e, "x")) cut();
  // if (checkCtrl(e, "c", false)) copy();
  // if (checkCtrl(e, "v")) paste();
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