import {EOL} from "@tauri-apps/api/os";
import app from "@/utils/core/app.js";
import {Insert} from "@/utils/editor/tools/insert.js";
import {Locate} from "@/utils/editor/tools/locate.js";
import {Replace} from "@/utils/editor/tools/replace.js";
import {Select} from "@/utils/editor/tools/select.js";

export function Editor() {
  this.el = document.getElementById('editor');
  this.el.select.reset();
  this.el.focus()

  //editor tools
  this.insert = new Insert();
  this.locate = new Locate();
  this.replace = new Replace();
  this.select = new Select();
  
  //states
  this.suggestion = null;
  this.synonyms = null;

  this.update = () => {
    const nextChar = this.el.value.substr(this.el.selectionEnd, 1)

    this.select.word = this.locate.active_word()
    this.suggestion = (nextChar === '' || nextChar === ' ' || nextChar === EOL) ? app.dictionary.find_suggestion(this.select.word) : null
    this.synonyms = app.dictionary.find_synonym(this.select.word)
    this.select.url = this.locate.active_url()
  }

  this.selection = () => {
    const from = this.el.selectionStart
    return this.el.value.substr(from, this.el.selectionEnd - from)
  }
  
  // this.autocomplete = () => {
  //   this.insert.text(this.suggestion.substr(this.select.word.length, this.suggestion.length) + ' ')
  // }

  // this.open_url = function (target = this.locate.active_url()) {
  //   if (!target) return;
  //
  //   this.select.word(target)
  //   setTimeout(() => open(target), 500)
  // }
}  