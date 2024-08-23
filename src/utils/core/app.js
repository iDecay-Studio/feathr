import {Editor} from "@/utils/core/editor.js";
import {Settings} from "@/utils/core/settings.js";
import {Dictionary} from "@/utils/core/modules/dictionary.js";
import {CmdBar} from "@/utils/core/modules/cmdBar.js";
import {Go} from "@/utils/core/modules/go.js";
import {Stats} from "@/utils/core/modules/stats.js";
import {Sidebar} from "@/utils/core/modules/sidebar.js";
import {Project} from "@/utils/editor/project.js";
import {discardPrompt} from "@/utils/ui/prompts.js";
import {getCurrentWebviewWindow} from "@tauri-apps/api/webviewWindow";
import {initEvents} from "@/utils/events/events.js";
import {initDragDrop} from "@/utils/events/drag-drop.js";

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

  quit = () => discardPrompt(getCurrentWebviewWindow().close);
}

export const app = await new App();