import {app} from "@shared/utils/core/app.js";
import {EOL} from "@shared/utils/core/utils.js";

export class Stats {
  init = async () => {
    this.el = document.getElementById('stats');
  }

  update = async () => {
    if (app.editor.insert.is_active) {
      this.el.innerHTML = app.editor.insert.status();
      return;
    }

    if (app.editor.el.selectionStart !== app.editor.el.selectionEnd) this.el.innerHTML = this._selection();
    else if (app.editor.synonyms) {
      this.el.innerHTML = '';
      this.el.appendChild(this._synonyms());
    } else if (app.editor.select.word && app.editor.suggestion) this.el.innerHTML = this._suggestion();
    else if (app.editor.select.url) this.el.innerHTML = this._url();
    else this.el.innerHTML = "";
  };

  _default = () => {
    const stats = this.parse(app.editor.selection());

    const sep = ", ";
    let result = "";
    result += stats.l + ' ' + (stats.l === 1 ? "line" : "lines") + sep;
    result += stats.c + ' ' + (stats.c === 1 ? "char" : "chars") + sep;
    result += stats.w + ' ' + (stats.w === 1 ? "word" : "words") + ` (${stats.v} unique)`;
    
    return result;
  };

  incrementSynonym = () => {
    app.editor.select.index = (app.editor.select.index + 1) % app.editor.synonyms.length;
  };

  list = null;
  isSynonymsActive = false;

  // nextSynonym = () => {
  //   this.isSynonymsActive = true;
  //
  //   // Save the previous word element
  //   const previousWord = this.list.children[app.editor.select.index];
  //
  //   // Increment the index
  //   this.incrementSynonym();
  //
  //   // Get the current word element, add/remove appropriate active class
  //   const currentWord = this.list.children[app.editor.select.index];
  //   previousWord.classList.remove('active');
  //   currentWord.classList.add('active');
  //
  //   currentWord.scrollIntoView({behavior: 'smooth'});
  // };

  applySynonym = () => {
    if (!this.isSynonymsActive) return;

    // Replace the current word with the selected synonym
    app.editor.replace.active_word(app.editor.synonyms[app.editor.select.index % app.editor.synonyms.length]);
  };

  _synonyms = () => {
    app.editor.select.index = 0;
    const ul = document.createElement('ul');

    app.editor.synonyms.forEach((syn) => {
      const li = document.createElement('li');
      li.textContent = syn;
      ul.appendChild(li);
    });

    ul.children[0].classList.add('active');
    this.el.scrollLeft = 0;
    this.list = ul;

    return ul;
  };

  _suggestion = () => `<t>${app.editor.select.word}<b>${app.editor.suggestion.substring(app.editor.select.word.length, app.editor.suggestion.length)}</b></t>`;
  _selection = () => `<b>[${app.editor.el.selectionStart},${app.editor.el.selectionEnd}]</b> ${this._default()}`;

  _url = () => `Open <b>${app.editor.select.url}</b> with &lt;Ctrl+B&gt;`;

  parse = (text = app.editor.el.value) => {
    text = text.length > 5 ? text.trim() : app.editor.el.value;

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