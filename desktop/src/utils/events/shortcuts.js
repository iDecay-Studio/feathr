import {app} from "@leaf/shared/utils/core/app.js";
import {editMenu, fileMenu, goMenu, settingsMenu} from "@leaf/shared/utils/ui/menu.js";

//maybe use the Tauri globalShortcut module instead, but I don't see any advantage over the native JS approach (https://tauri.app/v1/api/js/globalshortcut/)
const preventDef = (e) => {e.preventDefault(); return true};
const checkKey = (e, key, prevDef = true) => e.key.toLowerCase() === key && (!prevDef || preventDef(e));
// const checkCtrl = (e, key, prevDef = true) => (e.ctrlKey || e.metaKey) && checkKey(e, key) && (!prevDef || preventDef(e));
// const checkShift = (e, key, prevDef = true) => e.shiftKey && checkKey(e, key, prevDef);
// const checkCtrlShift = (e, key, prevDef = true) => e.shiftKey && checkCtrl(e, key, prevDef);

export function initShortcuts() {
  document.onkeydown = async function keyDown(e) {
    if (e.repeat) return;

    //general
    if (checkKey(e, "escape")) {
      app.settings.focusMode.set(false);
      app.cmdBar.close();
    }
    
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