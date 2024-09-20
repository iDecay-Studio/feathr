import app from "@feathr/shared/js/core/app.js";
import {EOL, isMobile} from "@feathr/shared/js/core/utils.js";
import {format, unwrapFunctionStore} from 'svelte-i18n';

const _ = unwrapFunctionStore(format);

export class Stats {
  el = null;

  update = async () => {
    if (!this.el) return;
    
    let hasSelection = app.editor.el.selectionStart !== app.editor.el.selectionEnd;
    this.el.innerHTML = !isMobile && hasSelection ? this.#selection() : "";
    this.el.classList.toggle('hidden', this.el.innerHTML === ""); 
  };

  #selection = () => `<b>[${app.editor.el.selectionStart},${app.editor.el.selectionEnd}]</b> ${this.#default()}`;

  #default = () => {
    const stats = this.#parse(app.editor.selection.get());

    const sep = ", ";
    let result = "";
    result += stats.l + ' ' + _("stats.line" + (stats.l === 1 ? '' : 's')) + sep;
    result += stats.c + ' ' + _("stats.char" + (stats.c === 1 ? '' : 's')) + sep;
    result += stats.w + ' ' + _("stats.word" + (stats.w === 1 ? '' : 's')) + ` (${stats.v} ${_("stats.unique")})`;
    
    return result;
  };
  
  #parse = (text) => {
    text = text.trim();

    const h = {};
    const words = text.replace(EOL, ' ').split(' ');
    for (const id in words) h[words[id]] = 1;

    const stats = {};
    stats.l = text.split(EOL).length;
    stats.w = words.length;
    stats.c = text.replace(EOL, "").length;
    stats.v = Object.keys(h).length;
    return stats;
  };
}