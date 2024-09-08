import app from "@leaf/shared/js/core/app.js";
import {EOL} from "@leaf/shared/js/core/utils.js";
import {Insert} from "@leaf/shared/js/editor/tools/insert.js";
import {Locate} from "@leaf/shared/js/editor/tools/locate.js";
import {Replace} from "@leaf/shared/js/editor/tools/replace.js";
import {Selection} from "@leaf/shared/js/editor/tools/selection.js";
import {Caret} from "@leaf/shared/js/editor/tools/caret.js";
import {Highlighter} from "@leaf/shared/js/editor/tools/highlighter.js";
import {Suggestions} from "@leaf/shared/js/editor/tools/suggestions.js";

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

  textEdited = () => this.text().trim() !== this.startingState.trim();

  getMarkers = () => {
    const result = [];
    const lines = this.text().split(EOL);

    const add = (id, line, symbol, type) => result.push({
      id: result.length,
      text: line.replace(symbol, '').trim(),
      line: parseInt(id),
      type: type,
    });

    for (const id in lines) {
      const line = lines[id].trim();
      if (line.substring(0, 2) === '##') add(id, line, '##', 'subheader');
      else if (line.substring(0, 1) === '#') add(id, line, '#', 'header');
      else if (line.substring(0, 2) === '--') add(id, line, '--', 'comment');
    }

    return result;
  };
}  