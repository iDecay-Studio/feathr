import {Editor} from "@/utils/core/editor.js";
import {Settings} from "@/utils/core/settings.js";
import {Dictionary} from "@/utils/core/modules/dictionary.js";
import {CmdBar} from "@/utils/core/modules/cmdBar.js";
import {Go} from "@/utils/core/modules/go.js";
import {Stats} from "@/utils/core/modules/stats.js";
import {Sidebar} from "@/utils/core/modules/sidebar.js";
import {Project} from "@/utils/editor/project.js";
import {discardPrompt} from "@/utils/ui/prompts.js";
import {initEvents} from "@/utils/events/events.js";
import {initDragDrop} from "@/utils/events/drag-drop.js";
import {getCurrentWindow} from '@tauri-apps/api/window';
// import {check} from "@tauri-apps/plugin-updater";
// import {relaunch} from "@tauri-apps/plugin-process";

class App {
  dictionary = new Dictionary();
  editor = new Editor();
  cmdBar = new CmdBar();
  project = new Project();
  settings = new Settings();
  sidebar = new Sidebar();
  stats = new Stats();
  go = new Go();
  
  init = async () => {
    //references
    this.titleRef = document.getElementById('title');

    //init modules
    await this.settings.init();
    await this.editor.init();
    await this.sidebar.init();
    await this.stats.init();
    await this.project.init();
    await this.dictionary.init();
    await this.cmdBar.init();
    await this.go.init();
    
    await this.update();
    initEvents();
    initDragDrop();

    // const update = await check();
    // if (update?.available) {
    //   await update.downloadAndInstall();
    //   await relaunch();
    // }
  }
  
  update = async () => {
    await this.editor.update();
    await this.project.update();
    await this.sidebar.update();
    await this.stats.update();
  };

  load = (text) => {
    this.editor.el.value = text || '';
    this.update();
  };

  reload = async (force = false) => {
    this.project.page().reload(force);
    this.load(this.project.page().text);
  };

  // inFocusMode = async () => await getCurrentWindow().isFullscreen();
  setFocusMode = async (enable) => {
    await getCurrentWindow().setFullscreen(enable);
    //ToDo: hide header
  }

  quit = () => discardPrompt(getCurrentWindow().close);
}

export const app = await new App();