//based on: https://jh3y.medium.com/how-to-where-s-the-caret-getting-the-xy-position-of-the-caret-a24ba372990a
import {getCaretXY} from "@leaf/shared/js/core/utils.js";
import {app} from "@leaf/shared/js/core/app.js";
import {get, writable} from "svelte/store";
import {tick} from "svelte";

export class Suggestions {
  el = null;
  listStore = writable([]);
  selItemStore = writable(-1);
  editStart = -1;
  mode = ""; //the type of suggestions (either 'suggestions' or 'synonyms')
  
  init() {
    this.observer = new ResizeObserver(this.#updatePos.bind(this));
    this.observer.observe(app.editor.el);
  }
  
  set = (suggestions, mode = "") => {
    if (mode !== "") this.mode = mode;
    
    this.listStore.set([]);
    this.selItemStore.set(-1);
    if (!suggestions.length) return;

    tick().then(() => {
      this.listStore.set(suggestions);
      this.#onOpen();
    });
  }

  #onOpen() {
    const {selectionStart} = app.editor.el;
    this.editStart = selectionStart;

    // this.#filterSuggestions();
    this.#updatePos();
  }

  close = () => {
    this.set([]);
    app.editor.focus();
  }
  
  onScroll = () => this.#updatePos();
  
  onKeyEvent = e => {
    const {which, type} = e;
    const {selectionStart} = app.editor.el;
    
    // this.#filterSuggestions();
    if (!this.#hasItems()) return;

    //space/end
    if (which === 32 || which === 35) this.close();
    //back
    else if (which === 8 && selectionStart === this.editStart) this.close();
    //return
    else if (which === 13) this.selectItem();
    //up/down
    else if ((which === 38 || which === 40) && type === 'keydown') this.#onArrowKey(e, which === 40);
    //left/right
    else if ((which === 37 || which === 39) && selectionStart < this.editStart + 1) this.close();
    //any key
    // else this.#filterSuggestions();
  };

  #hasItems = () => get(this.listStore).length;
  // #isSuggestions = () => this.mode === "suggestions";
  // #isSynonyms = () => this.mode === "synonyms";
  // onSelectText = e => {}

  // #filterSuggestions = () => {
  //   let items = get(this.listStore);
  //   if (!items.length) return;
  //  
  //   const {selectionStart, value} = app.editor.el;
  //   const filter = value.slice(this.editStart + 1, selectionStart).toLowerCase();
  //  
  //   const filteredSuggestions = items.filter(entry => entry.toLowerCase().includes(filter));
  //   this.set(filteredSuggestions);
  // };

  selectItem = (click = false) => {
    let selID = get(this.selItemStore);
    
    if (selID >= 0) {
      let selectedText = get(this.listStore)[selID];
      const {selectionStart} = app.editor.el;

      const start = app.editor.el.value.slice(0, this.editStart);
      const end = app.editor.el.value.slice(click ? selectionStart + 1 : selectionStart, app.editor.el.value.length);
      app.editor.el.value = `${start}${selectedText}${end}`;
    }
    
    this.close();
  };

  #onArrowKey = (e, next) => {
    e.preventDefault();
    
    let items = get(this.listStore);
    if (items.length === 0) return;
    
    let selID = get(this.selItemStore);
    let lastID = items.length-1;

    //set selected item in list via arrow keys
    if (selID === -1) this.selItemStore.set(next ? 0 : lastID); //none selected
    else if (next && selID >= items.length-1) this.selItemStore.set(0); //last selected and pressing down
    else if (!next && selID <= 0) this.selItemStore.set(items.length-1); //first selected and pressing up
    else this.selItemStore.set(next ? selID+1 : selID-1); //select prev. or next item
    
    //scroll to the selected item
    let currItem = this.el.children.item(selID);
    currItem.scrollIntoView({behavior: 'smooth'});
  };

  #updatePos = () => {
    if (!app.editor.el) return;
    const {offsetLeft, offsetTop, offsetHeight, offsetWidth, scrollLeft, scrollTop, selectionEnd} = app.editor.el;
    const {lineHeight, paddingRight} = getComputedStyle(app.editor.el);
    const {x, y} = getCaretXY(app.editor.el, selectionEnd);

    const newLeft = Math.min(x - scrollLeft, offsetLeft + offsetWidth - parseInt(paddingRight, 10));
    const newTop = Math.min(y - scrollTop, offsetTop + offsetHeight - parseInt(lineHeight, 10));

    this.el.style.top = `${newTop}px`;
    this.el.style.left = `${newLeft}px`;
  }
}