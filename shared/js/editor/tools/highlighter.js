import app from "@feathr/shared/js/core/app.js";
import {currCmd, gotoCmd} from "@feathr/shared/js/core/modules/cmdBar.js";
import {isMobile} from "@feathr/shared/js/core/utils.js";
import {get} from "svelte/store";

export class Highlighter {
  el = null;
  searchArg = '';
  sensitive = false;
  indexes = []; //the index of each found occurrence
  selID = -1; //id of the currently active marker
  
  get = () => this.el ?? (this.el = document.getElementById('highlights'));
  
  init() {
    this.clear();
    
    if (!isMobile) {
      let ua = window.navigator.userAgent.toLowerCase();
      this.isIE = !!ua.match(/msie|trident\/7|edge/);
    } else this.isIE = false;
    
    this.update();

    //bring backdrop to front for clicking on link markers
    document.addEventListener('keydown', e => {
      if (e.ctrlKey && !e.shiftKey && !e.altKey) this.#setZPos(3);
    });
    
    document.addEventListener('keyup', () => this.#setZPos());
    this.#setZPos();
  }

  update = () => {
    this.get().innerHTML = this.#markText();
    this.onScroll();
    if (this.selID > -1) this.#setSelection();
  }

  onScroll() {
    this.get().scrollTop = app.editor.get().scrollTop || 0;
    this.get().scrollLeft = app.editor.get().scrollLeft || 0;

    // let sclLeft = app.editor.get().scrollLeft;
    // this.get().style.transform = (sclLeft > 0) ? `translateX(${-sclLeft}px)` : '';
  }

  search(val) {
    this.searchArg = val;
    this.sensitive = !!app.settings.caseSensitive.storeVal();
    this.word = !!app.settings.matchWords.storeVal();
    this.update();
    this.selID = -1;
    this.next();
  }

  next() {
    this.selID += 1;
    this.#setSelection(true);
  }

  prev() {
    this.selID -= 1;
    this.#setSelection(true);
  }

  count = () => this.el.querySelectorAll('mark').length;

  clear() {
    this.get().innerHTML = this.get().textContent;
    this.searchArg = '';
    this.selID = -1;
    this.indexes = [];
  }
  
  #markText() {
    let text = app.editor.text().replace(/</g, '&lt;').replace(/>/g, '&gt;');
    text = text.replace(/\n$/g, '\n\n');

    if (this.searchArg) {
      let searchArg = this.searchArg.replace(/</g, '&lt;').replace(/>/g, '&gt;');
      let boundary = this.word ? '\\b' : '';

      let regExSearch = new RegExp(`${boundary}(${this.#escapeString(searchArg)})${boundary}`, `g${this.sensitive ? '' : 'i'}`);
      text = text.replace(regExSearch, '<mark>$&</mark>');
      
      this.indexes = [...app.editor.text().matchAll(regExSearch)].map(a => a.index);

      // IE wraps whitespace differently in a div vs textarea, this fixes it
      if (this.isIE) text = text.replace(/ /g, ' <wbr>');
    }

    text = text.replace(/(https:|http:|ftp:|www\.)\S*/gm, '<a href="$&" class="link">$&</a>')
    text = text.replace(/[^\s@]+@[^\s@]+\.[^\s@]+/gm, '<a href="mailto:$&" class="email">$&</a>');
    text = text.replace(/ (\/\/[^\r*\n]*)/gm, '<p class="comment">$&</p>');

    return text;
  }

  #escapeString(txt) {
    let specials = ['-', '[', ']', '/', '{', '}', '(', ')', '*', '+', '?', '.', '\\', '^', '$', '|'];
    return txt.replace(RegExp(`[${specials.join('\\')}]`, 'g'), '\\$&');
  }

  #setSelection(scroll = false) {
    if (get(currCmd) === gotoCmd) return;
    
    let nodes = this.get().querySelectorAll('mark');
    let len = nodes.length;

    if (this.selID >= len) this.selID = 0;
    if (this.selID < 0) this.selID = len - 1;
    
    let currNode = nodes[this.selID];
    let currIndex = this.indexes[this.selID];
    
    if (currNode) app.go.to(currIndex, currIndex + currNode.textContent.length);
    // if (scroll) app.editor.get().scrollTop = currNode.offsetTop > 10 ? currNode.offsetTop - 10 : currNode.offsetTop;

    for (let i = 0; i < len; i++)
      nodes[i].classList.toggle('sel', i === this.selID);
  }

  #setZPos = (id = 1) => {
    if (this.get()) this.el.style.zIndex = id;
  }
}