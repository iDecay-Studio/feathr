import app from "@feathr/shared/js/core/app.js";
import {editMenu, fileMenu, goMenu, settingsMenu} from "@feathr/shared/js/ui/menu.js";
import {get} from "svelte/store";

const checkKey = (e, key, exclusive = true, prevDef = true) => {
  if (exclusive && (e.ctrlKey || e.shiftKey || (e.altKey && key !== "alt"))) return false;
  let result = e.key.toLowerCase() === key;
  if (result && prevDef) e.preventDefault();
  return result;
}

export function initShortcuts() {
  document.onkeydown = async function keyDown(e) {
    if (e.repeat) return;

    if (checkKey(e, "escape")) {
      app.settings.focusMode.set(false);
      app.settings.showMenubar.set(true);
      app.editor.suggestions.close();
      app.cmdBar.close();
      return;
    }
    
    if (checkKey(e, "alt")) {
      if (!app.settings.focusMode.storeVal()) app.settings.showMenubar.toggle();
      return;
    }
    
    const execShortcuts = (item) => {
      if (item.submenu && item.submenu.length) {
        item.submenu.forEach(execShortcuts);
        return;
      }
      
      let shortcut = item.shortcut;
      if (!shortcut) return;
      
      let reqCtrl = shortcut.includes('Ctrl');
      let reqShift = shortcut.includes('Shift');
      if (reqCtrl && !e.ctrlKey || !reqCtrl && e.ctrlKey) return;
      if (reqShift && !e.shiftKey || !reqShift && e.shiftKey) return;

      let key = shortcut;
      if (shortcut.includes('[+]')) key = '+';
      else if (shortcut.includes('[-]')) key = '-';
      else if (shortcut.includes('+')) key = shortcut.split('+').slice(-1)[0];
      
      if (e.key.toLowerCase() === key.toLowerCase()) {
        e.preventDefault();
        if (item.action) item.action();
        if (item.setting) item.setting().toggle();
      }
    }

    get(fileMenu).forEach(execShortcuts);
    get(editMenu).forEach(execShortcuts);
    get(goMenu).forEach(execShortcuts);
    get(settingsMenu).forEach(execShortcuts);
  }
}