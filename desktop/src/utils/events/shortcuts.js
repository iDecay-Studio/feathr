import {app} from "@leaf/shared/utils/core/app.js";
import {editMenu, fileMenu, goMenu, settingsMenu} from "@leaf/shared/utils/ui/menu.js";

const checkKey = (e, key, exclusive = true, prevDef = true) => {
  if (exclusive && (e.ctrlKey || e.shiftKey || (e.altKey && key !== "alt"))) return false;
  if (prevDef) e.preventDefault();
  return e.key.toLowerCase() === key;
}

export function initShortcuts() {
  document.onkeydown = async function keyDown(e) {
    if (e.repeat) return;

    if (checkKey(e, "escape")) {
      app.settings.focusMode.set(false);
      app.cmdBar.close();
    }

    if (checkKey(e, "alt")) app.settings.showMenubar.toggle();
    
    const execShortcuts = (item) => {
      if (item.submenu) {
        item.submenu.forEach(execShortcuts);
        return;
      }
      
      let shortcut = item.shortcut;
      if (!shortcut) return;
      if (shortcut.includes('Ctrl') && !e.ctrlKey) return;
      if (shortcut.includes('Shift') && !e.shiftKey) return;

      let key = shortcut;
      if (shortcut.includes('[+]')) key = '+';
      else if (shortcut.includes('[-]')) key = '-';
      else if (shortcut.includes('+')) key = shortcut.split('+').slice(-1)[0];
      
      if (e.key.toLowerCase() === key.toLowerCase()) {
        e.preventDefault();
        if (item.action) item.action();
        if (item.setting) item.setting.toggle();
      }
    }

    fileMenu.forEach(execShortcuts);
    editMenu.forEach(execShortcuts);
    goMenu.forEach(execShortcuts);
    settingsMenu.forEach(execShortcuts);
  }
}