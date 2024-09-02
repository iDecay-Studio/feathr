import {Editor} from "@leaf/shared/js/editor/editor.js";
import {Settings} from "@leaf/shared/js/core/settings.js";
import {Dictionary} from "@leaf/shared/js/core/modules/dictionary.js";
import {CmdBar} from "@leaf/shared/js/core/modules/cmdBar.js";
import {Go} from "@leaf/shared/js/core/modules/go.js";
import {Stats} from "@leaf/shared/js/core/modules/stats.js";
import {Sidebar} from "@leaf/shared/js/core/modules/sidebar.js";
import {File} from "@leaf/shared/js/editor/file.js";
import {discardPrompt} from "@leaf/shared/js/ui/prompts.js";
import {initEvents} from "@leaf/shared/js/events/events.js";
import {getCurrentWindow} from '@tauri-apps/api/window';
import {inApp} from "@leaf/shared/js/core/utils.js";
// import {check} from "@tauri-apps/plugin-updater";
// import {relaunch} from "@tauri-apps/plugin-process";

class App {
  editor = new Editor();
  file = new File();
  dictionary = new Dictionary();
  cmdBar = new CmdBar();
  sidebar = new Sidebar();
  stats = new Stats();
  go = new Go();
  settings = new Settings();
  
  init = async (isMobile = false) => {
    this.isMobile = isMobile;
    this.titleRef = document.getElementById('title');

    //init modules
    await this.file.init();
    this.dictionary.init();
    this.editor.init();
    this.settings.init();
    
    await this.update();
    initEvents();

    // const update = await check();
    // if (update?.available) {
    //   await update.downloadAndInstall();
    //   await relaunch();
    // }
  }
  
  update = async () => {
    await this.editor.update();
    await this.file.update();
    await this.sidebar.update();
    await this.stats.update();
  };

  setFocusMode = async (enable) => {
    if (inApp) await getCurrentWindow().setFullscreen(enable);
    document.documentElement.classList.toggle('focus-mode', enable);
  }

  quit = () => inApp && discardPrompt(getCurrentWindow().close);
}

export const app = new App();