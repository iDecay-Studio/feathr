import app from "@feathr/shared/js/core/app.js";
import {Insert} from "@feathr/shared/js/editor/tools/insert.js";
import {Locate} from "@feathr/shared/js/editor/tools/locate.js";
import {Replace} from "@feathr/shared/js/editor/tools/replace.js";
import {Selection} from "@feathr/shared/js/editor/tools/selection.js";
import {Caret} from "@feathr/shared/js/editor/tools/caret.js";
import {Highlighter} from "@feathr/shared/js/editor/tools/highlighter.js";
import {Suggestions} from "@feathr/shared/js/editor/tools/suggestions.js";

export class Editor {
  textEdited = false;
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
    this.el = document.getElementById('editor');
    
    this.selection.reset();
    this.caret.init();
    this.suggestions.init();
    this.highlighter.init();
    
    this.focus();
  }

  update = async () => {
    this.caret.update();
    this.highlighter.update();
  };

  set = (val = "") => {
    this.el.value = val;
    this.selection.clamp();
    app.update();

    setTimeout(() => {
      this.focus()
    }, 200);
  }
  reset(val = "") {
    this.startingState = val;
    this.textEdited = false;
    app.settings.unsavedChanges.reset();
    this.set(val);
  }

  text = () => this.el.value;
  focus = () => this.el.focus();
  isFocused = () => this.el === document.activeElement;
}  