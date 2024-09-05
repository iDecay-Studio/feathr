import app from "@leaf/shared/js/core/app.js";
import {EOL} from "@leaf/shared/js/core/utils.js";

export class Locate {
  find = (word) => {
    const text = app.editor.text().toLowerCase();
    const parts = text.split(word.toLowerCase());
    const a = [];
    let sum = 0;

    for (const id in parts) {
      const p = parts[id].length;
      a.push(sum + p);
      sum += p + word.length;
    }

    a.splice(-1, 1);
    return a;
  };

  active_word_location = (position = app.editor.el.selectionEnd) => {
    let from = position - 1;
    let text = app.editor.text().toLowerCase();

    // Find beginning of word
    while (from > -1) {
      const char = text[from];
      if (!char || !char.match(/[a-z]/i)) break;
      from -= 1;
    }

    // Find end of word
    let to = from + 1;
    while (to < from + 30) {
      const char = text[to];
      if (!char || !char.match(/[a-z]/i)) break;
      to += 1;
    }

    from += 1;

    return {from: from, to: to};
  };
  active_word = () => {
    const l = this.active_word_location();
    return app.editor.text().slice(l.from, l.to);
  };

  active_line_id = () => {
    const segments = app.editor.text().substring(0, app.editor.el.selectionEnd).split(EOL);
    return segments.length - 1;
  };

  // active_line = () => {
  //   const text = app.editor.text();
  //   const lines = text.split(EOL);
  //   return lines[this.active_line_id()];
  // };

  // active_url = () => {
  //   const words = this.active_line().split(' ');
  //   for (const id in words) {
  //     if (words[id].indexOf('://') > -1 || words[id].indexOf('www.') > -1) return words[id];
  //   }
  //   return null;
  // };

  // prev_character = () => {
  //   const l = this.active_word_location()
  //   return app.editor.text().substring(l.from - 1, l.from)
  // }
}