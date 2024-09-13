import app from "@feathr/shared/js/core/app.js";
import {EOL} from "@feathr/shared/js/core/utils.js";
import {Insert} from "@feathr/shared/js/editor/tools/insert.js";
import {Locate} from "@feathr/shared/js/editor/tools/locate.js";
import {Replace} from "@feathr/shared/js/editor/tools/replace.js";
import {Selection} from "@feathr/shared/js/editor/tools/selection.js";
import {Caret} from "@feathr/shared/js/editor/tools/caret.js";
import {Highlighter} from "@feathr/shared/js/editor/tools/highlighter.js";
import {Suggestions} from "@feathr/shared/js/editor/tools/suggestions.js";

export class Editor {
  el = null;
  startingState = ""; //the editor content after opening the current file or app

  //editor tools
  caret = new Caret();
  highlighter = new Highlighter();
  suggestions = new Suggestions();
  selection = new Selection();
  insert = new Insert();
  locate = new Locate();
  replace = new Replace();

  init() {
    this.focus();
    this.selection.reset();
    
    this.caret.init();
    this.suggestions.init();
    this.highlighter.init();
  }

  update = async () => {
    this.highlighter.update();
  };

  get = () => this.el ?? (this.el = document.getElementById('editor'));
  set = (val = "") => {
    this.get().value = val;
    this.selection.clamp();
    app.update();

    setTimeout(() => {
      this.focus()
    }, 200);
  }
  reset(val = "") {
    this.startingState = val;
    this.set(val);
  }

  text = () => this.get().value;
  focus = () => this.get().focus();
  isFocused = () => this.get() === document.activeElement;

  textEdited = () => this.text().trim() !== this.startingState.trim();
}  