import {app} from "@/utils/core/app.js";
import {EOL} from "@/utils/core/utils.js";

export function Select() {
  this.word = null;
  this.index = 1;

  this.set = (from, to) => app.editor.el.setSelectionRange(from, to);
  this.reset = () => app.editor.el.setSelectionRange(0, 0);

  // this.word = (target) => {
  //   const from = app.editor.el.value.split(target)[0].length
  //   this.set(from, from + target.length)
  // }
  // this.line = (id) => {
  //   const lineArr = app.editor.el.value.split(EOL, parseInt(id) + 1)
  //   const arrJoin = lineArr.join(EOL)
  //
  //   const from = arrJoin.length - lineArr[id].length
  //   const to = arrJoin.length
  //
  //   this.set(from, to)
  // }

  this.autocomplete = () => {
    if (this.word.trim() !== '' && app.editor.suggestion && app.editor.suggestion.toLowerCase() !== app.editor.locate.active_word().toLowerCase()) {
      this.autocomplete();
    } else {
      app.editor.insert.text('\t');
    }
  };

  this.synonym = () => {
    const syn = app.editor.synonyms;
    if (!syn) return;

    app.editor.replace.active_word(syn[this.index % syn.length]);
    app.stats.update();
    this.index = (this.index + 1) % syn.length;
  };
}