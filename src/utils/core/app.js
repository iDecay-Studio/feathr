import {Editor} from "@/utils/core/modules/editor.js";
import {Settings} from "@/utils/core/modules/settings.js";
import {Dictionary} from "@/utils/core/modules/dictionary.js";
import {Operator} from "@/utils/core/modules/operator.js";
import {Go} from "@/utils/core/modules/go.js";
import {Stats} from "@/utils/core/modules/stats.js";
import {Sidebar} from "@/utils/core/modules/sidebar.js";
import {Project} from "@/utils/editor/project.js";
import {discardPrompt} from "@/utils/ui/prompts.js";
import {appWindow} from "@tauri-apps/api/window";

function App() {
  //references
  this.titleRef = document.getElementById('title');

  //init modules
  this.editor = new Editor();
  this.settings = new Settings();
  this.project = new Project();
  this.dictionary = new Dictionary();
  this.operator = new Operator();
  this.sidebar = new Sidebar();
  this.stats = new Stats();
  this.go = new Go();
  this.update();

  this.update = () => {
    this.editor.update();
    this.project.update();
    this.sidebar.update();
    this.stats.update();
  };

  this.load = (text) => {
    this.editor.el.value = text || '';
    this.update();
  };

  this.reload = (force = false) => {
    this.project.page().reload(force);
    this.load(this.project.page().text);
  };

  this.quit = () => discardPrompt(appWindow.close);
}

const app = new App();
export default app;