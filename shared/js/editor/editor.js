import {app} from "@leaf/shared/js/core/app.js";
import {EOL} from "@leaf/shared/js/core/utils.js";
import {Insert} from "@leaf/shared/js/editor/tools/insert.js";
import {Locate} from "@leaf/shared/js/editor/tools/locate.js";
import {Replace} from "@leaf/shared/js/editor/tools/replace.js";
import {Select} from "@leaf/shared/js/editor/tools/select.js";
import {Caret} from "@leaf/shared/js/editor/tools/caret.js";
import {Highlighter} from "@leaf/shared/js/editor/tools/highlighter.js";
import {Suggestions} from "@leaf/shared/js/editor/tools/suggestions.js";

export class Editor {
  startingState = ""; //the editor content after opening the current file or app
  textEdited = () => this.el.value !== this.startingState;
  
  init = async () => {
    this.el = document.getElementById('editor');
    this.el.focus();

    //editor tools
    this.caret = new Caret();
    this.highlighter = new Highlighter();
    this.suggestions = new Suggestions();
    this.insert = new Insert();
    this.locate = new Locate();
    this.replace = new Replace();
    this.select = new Select();
    this.select.reset();

    //states
    this.suggestion = null;
    this.synonyms = null;
  }

  update = async () => {
    this.select.word = this.locate.active_word();
    const nextChar = this.el.value.substring(this.el.selectionEnd, 1);
    this.suggestion = (nextChar === '' || nextChar === ' ' || nextChar === EOL) ? app.dictionary.find_suggestion(this.select.word) : null;
    this.synonyms = app.dictionary.find_synonym(this.select.word);
    this.select.url = this.locate.active_url();
    this.highlighter.update();
  };
  
  text = () => this.el.value;
  focus = () => this.el.focus();
  
  set = (val = "") => {
    this.el.value = val;
    this.el.setSelectionRange(0, 0);
    app.update();

    setTimeout(() => {
      app.editor.focus()
    }, 200);
  }
  reset(val = "") {
    this.startingState = val;
    this.set(val);
  }

  onInput(e) {
    this.caret.update(e);
    this.highlighter.update();
    if (this.textEdited()) app.settings.unsavedChanges.set(this.el.value);
  }

  getSelection = () => {
    const from = this.el.selectionStart;
    return this.el.value.substring(from, this.el.selectionEnd - from);
  };

  getMarkers = () => {
    const result = [];
    const lines = app.editor.text().split(EOL);

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

  // autocomplete = () => {
  //   this.insert.text(this.suggestion.substring(this.select.word.length, this.suggestion.length) + ' ')
  // }

  // open_url = (target = this.locate.active_url()) => {
  //   if (!target) return;
  //
  //   this.select.word(target)
  //   setTimeout(() => open(target), 500)
  // }
}  