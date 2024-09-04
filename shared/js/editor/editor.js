import app from "@leaf/shared/js/core/app.js";
import {EOL} from "@leaf/shared/js/core/utils.js";
import {Insert} from "@leaf/shared/js/editor/tools/insert.js";
import {Locate} from "@leaf/shared/js/editor/tools/locate.js";
import {Replace} from "@leaf/shared/js/editor/tools/replace.js";
import {Select} from "@leaf/shared/js/editor/tools/select.js";
import {Caret} from "@leaf/shared/js/editor/tools/caret.js";
import {Highlighter} from "@leaf/shared/js/editor/tools/highlighter.js";
import {Suggestions} from "@leaf/shared/js/editor/tools/suggestions.js";

export class Editor {
  el = null;
  startingState = ""; //the editor content after opening the current file or app
  suggestionList = []; //the current auto-complete suggestion
  synonymList = []; //list of synonyms matching the currently selected word

  //editor tools
  caret = new Caret();
  highlighter = new Highlighter();
  suggestions = new Suggestions();
  insert = new Insert();
  locate = new Locate();
  replace = new Replace();
  select = new Select();

  init() {
    this.el.focus();
    this.select.reset();
    
    this.caret.init();
    this.suggestions.init();
    this.highlighter.init();
  }

  update = async () => {
    this.highlighter.update();
    this.select.word = this.locate.active_word();
    const nextChar = this.text().substring(this.el.selectionEnd, 1);
    
    this.suggestionList = (nextChar === '' || nextChar === ' ' || nextChar === EOL) ? app.dictionary.find_suggestions(this.select.word) : [];
    this.synonymList = app.dictionary.find_synonyms(this.select.word);
    
    //update suggestion dropdown
    if (this.select.word && this.synonymList.length) this.suggestions.set(this.synonymList, "synonyms");
    else if (this.suggestionList.length) this.suggestions.set(this.suggestionList, "suggestions");
    else this.suggestions.set([]);
  };
  
  set = (val = "") => {
    this.el.value = val;
    this.select.reset();
    app.update();

    setTimeout(() => {
      this.focus()
    }, 200);
  }
  reset(val = "") {
    this.startingState = val;
    this.set(val);
  }

  text = () => this.el.value;
  focus = () => this.el.focus();

  textEdited = () => this.text() !== this.startingState;

  getSelection = () => {
    const from = this.el.selectionStart;
    return this.text().substring(from, this.el.selectionEnd);
  };

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