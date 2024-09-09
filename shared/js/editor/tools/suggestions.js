//based on: https://jh3y.medium.com/how-to-where-s-the-caret-getting-the-xy-position-of-the-caret-a24ba372990a
import {getCaretXY, shuffle} from "@feathr/shared/js/core/utils.js";
import app from "@feathr/shared/js/core/app.js";
import {get, writable} from "svelte/store";
import {tick} from "svelte";

const minWordLength = 4;
const maxSuggestions = 10;

export class Suggestions {
  isOpen = writable(false);
  listStore = writable([]);
  selItemStore = writable(-1);
  el = null;
  editStart = -1;
  mode = ""; //the type of suggestions (either 'autocomplete' or 'synonyms')
  
  init() {
    this.observer = new ResizeObserver(this.#updatePos.bind(this));
    this.observer.observe(app.editor.el);
  }
  
  update() {
    if (app.cmdBar.isOpen) return;
    
    if (this.mode === '') {
      this.set([]);
      return;
    }
    
    if (this.#isAutocomplete()) {
      let currWord = app.editor.selection.word();
      if (!currWord || currWord.length < minWordLength) return;
      
      let nextChar = app.editor.selection.nextChar();
      if (!!nextChar && nextChar !== ' ' && nextChar !== "\n" && nextChar !== "\r\n") return;
      
      let suggestionList = app.dictionary.find_suggestions(currWord);
      if (suggestionList.length) this.set(suggestionList.slice(0, maxSuggestions));
      else this.close();
    }
    else if (this.#isSynonyms()) {
      let currWord = app.editor.selection.get().trim();
      if (!currWord || currWord.length < minWordLength) {
        this.close();
        return;
      }
      
      let synonymList = app.dictionary.find_synonyms(currWord);
      if (synonymList.length) this.set(shuffle(synonymList).slice(0, maxSuggestions));
      else this.close();
    }
  }
  
  open() {
    if (get(this.isOpen)) return;
    
    this.isOpen.set(true);
    this.selItemStore.set(-1);
    this.editStart = app.editor.el.selectionStart;
    this.#updatePos();
  }
  
  close() {
    if (!get(this.isOpen)) return;

    this.isOpen.set(false);
    this.mode = '';
    this.set([]);
  }
  
  set = (suggestions) => {
    this.listStore.set([]);
    
    if (suggestions.length) {
      tick().then(() => this.listStore.set(suggestions));
      this.open();
    }
  }

  selectItem = (e, id = null) => {
    if (!get(this.isOpen) || !this.#hasItems()) {
      this.close();
      return;
    }
    if (e.type === 'keypress') {
      if (get(this.selItemStore) >= 0) e.preventDefault();
      else {
        this.close();
        return;
      }
    }

    let selID = id ?? get(this.selItemStore);
    if (selID < 0) return;

    let selectedText = get(this.listStore)[selID];
    let whitespace = app.editor.selection.nextChar() !== ' ' ? ' ' : '';
    let insert = this.#isAutocomplete() ? selectedText.substring(app.editor.selection.word().length) + whitespace : selectedText;
    app.editor.insert.text(insert);

    // const {selectionStart} = app.editor.el;
    //
    // const start = app.editor.el.value.slice(0, this.editStart);
    // const end = app.editor.el.value.slice(selectionStart, app.editor.el.value.length);
    //
    // app.editor.set(`${start}${selectedText}${end}`);
    // app.editor.selection.set(selectionStart + selectedText.length);
    
    this.close();
  };

  onKeyEvent = e => {
    const {which, type} = e;
    const {selectionStart} = app.editor.el;
    
    //shift/ctrl/alt
    if (which === 16 || which === 17 || which === 18) return;

    //space/end
    if (which === 32 || which === 35) this.close();
    //back
    else if (which === 8) {
      if (selectionStart === this.editStart) this.close();
      else this.update();
    }
    //return
    else if (which === 13) {
      if (type === 'keypress') this.selectItem(e);
    }
    //up/down
    else if (which === 38 || which === 40) {
      if (type === 'keydown') this.#onArrowKey(e, which === 40);
    }
    //left/right
    else if (which === 37 || which === 39) {
      if (type !== 'keyup') return;
      if (this.#isSynonyms()) this.update();
      else if (selectionStart < this.editStart + 1) this.close();
    }
    //any key
    else if (type === 'keyup') {
      this.mode = 'autocomplete';
      this.update();
    }
  };

  onSelectText = () => {
    this.mode = 'synonyms';
    this.update();
  }

  onScroll = () => this.#updatePos();

  #hasItems = () => get(this.listStore).length;
  #isAutocomplete = () => this.mode === "autocomplete";
  #isSynonyms = () => this.mode === "synonyms";

  #onArrowKey = (e, next) => {
    if (!get(this.isOpen)) return;

    let items = get(this.listStore);
    if (items.length === 0) return;
    e.preventDefault();
    
    let selID = get(this.selItemStore);
    let lastID = items.length-1;

    //set selected item in list via arrow keys
    if (selID === -1) selID = next ? 0 : lastID; //none selected
    else if (next && selID >= items.length-1) selID = 0; //last selected and pressing down
    else if (!next && selID <= 0) selID = items.length-1; //first selected and pressing up
    else selID = next ? selID+1 : selID-1; //select prev. or next item
    
    //scroll to the selected item
    let currItem = this.el.children.item(selID);
    currItem.scrollIntoView({behavior: 'smooth', block: 'center'});
    
    this.selItemStore.set(selID);
  };

  #updatePos = () => {
    if (!this.el || !app.editor.el) return;
    const {offsetLeft, offsetTop, offsetHeight, offsetWidth, scrollLeft, scrollTop, selectionEnd} = app.editor.el;
    const {lineHeight, paddingRight} = getComputedStyle(app.editor.el);
    const {x, y} = getCaretXY(app.editor.el, selectionEnd);

    const newLeft = Math.min(x - scrollLeft, offsetLeft + offsetWidth - parseInt(paddingRight, 10));
    const newTop = Math.min(y - scrollTop, offsetTop + offsetHeight - parseInt(lineHeight, 10));

    this.el.style.top = `${newTop}px`;
    this.el.style.left = `${newLeft}px`;
  }
}