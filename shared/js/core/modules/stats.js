import app from "@leaf/shared/js/core/app.js";
import {EOL} from "@leaf/shared/js/core/utils.js";

export class Stats {
  el = null;

  update = async () => {
    let hasSelection = app.editor.el.selectionStart !== app.editor.el.selectionEnd;
    this.el.innerHTML = hasSelection ? this.#selection() : "";
  };

  #selection = () => `<b>[${app.editor.el.selectionStart},${app.editor.el.selectionEnd}]</b> ${this.#default()}`;
  // #suggestion = () => `<t>${app.editor.select.word}<b>${app.editor.suggestion.substring(app.editor.select.word.length, app.editor.suggestion.length)}</b></t>`;

  #default = () => {
    const stats = this.#parse(app.editor.getSelection());

    const sep = ", ";
    let result = "";
    result += stats.l + ' ' + (stats.l === 1 ? "line" : "lines") + sep;
    result += stats.c + ' ' + (stats.c === 1 ? "char" : "chars") + sep;
    result += stats.w + ' ' + (stats.w === 1 ? "word" : "words") + ` (${stats.v} unique)`;
    
    return result;
  };
  
  #parse = (text = app.editor.text()) => {
    text = text.length > 5 ? text.trim() : app.editor.text();

    const h = {};
    const words = text.toLowerCase().replace(/[^a-z0-9 ]/g, '').split(' ')
    for (const id in words) h[words[id]] = 1;

    const stats = {};
    stats.l = text.split(EOL).length;
    stats.w = words.length;
    stats.c = text.length;
    stats.v = Object.keys(h).length;
    return stats;
  };
}