import {app} from "@/utils/core/app.js";
import {EOL} from "@/utils/core/utils.js";
import {Insert} from "@/utils/editor/tools/insert.js";
import {Locate} from "@/utils/editor/tools/locate.js";
import {Replace} from "@/utils/editor/tools/replace.js";
import {Select} from "@/utils/editor/tools/select.js";

export class Editor {
  init = async () => {
    this.el = document.getElementById('editor');
    this.el.focus();

    //editor tools
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
    const nextChar = this.el.value.substring(this.el.selectionEnd, 1);

    this.select.word = this.locate.active_word();
    this.suggestion = (nextChar === '' || nextChar === ' ' || nextChar === EOL) ? app.dictionary.find_suggestion(this.select.word) : null;
    this.synonyms = app.dictionary.find_synonym(this.select.word);
    this.select.url = this.locate.active_url();
  };

  selection = () => {
    const from = this.el.selectionStart;
    return this.el.value.substring(from, this.el.selectionEnd - from);
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