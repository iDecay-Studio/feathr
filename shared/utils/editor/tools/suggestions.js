//based on: https://jh3y.medium.com/how-to-where-s-the-caret-getting-the-xy-position-of-the-caret-a24ba372990a
import {createMarker, getCaretXY} from "@leaf/shared/utils/core/utils.js";
import {app} from "@leaf/shared/utils/core/app.js";

export class Suggestions {
  constructor() {
    this.input = app.editor.el;
    this.dropDown = null;
    this.selectedItem = null;
    this.suggestions = [];
    this.editStart = -1;
    
    this.observer = new ResizeObserver(this.update.bind(this));
    this.observer.observe(this.input);
  }
  
  set = (suggestions) => {
    this.suggestions = suggestions;
    this.#filterList();
  }

  update = e => {
    const {which, type} = e;
    const {selectionStart} = this.input;
    this.#filterList();
    
    if (this.dropDown) {
      switch (which) {
        case 32: //space
        case 35: //end
          this.close();
          break;
        case 8: //back
          if (selectionStart === this.editStart) this.close();
          break;
        case 13: //return
          if (this.selectedItem) this.#selectItem(this.dropDown.querySelector('.suggestion-item--active').textContent);
          else this.close();
          break;
        case 38: // up
        case 40: // down
          if (type === 'keydown') {
            e.preventDefault();
            this.#toggleItem(which === 38 ? 'previous' : 'next');
          }
          break;
        case 37: //left
        case 39: //right
          if (selectionStart < this.editStart + 1) this.close();
          break;
        default:
          this.#filterList();
          break;
      }
    }
  };
  
  open() {
    if (this.dropDown) return;
    
    const {selectionStart} = this.input;
    this.editStart = selectionStart;
    
    document.addEventListener('click', this.#onClick);
    this.dropDown = createMarker(null, 'suggestions');
    this.dropDown.addEventListener('click', this.#onClickItem);
    document.body.appendChild(this.dropDown);

    this.#filterList();
    this.#updatePos();
  }
  
  close() {
    if (!this.dropDown) return;

    document.removeEventListener('click', this.#onClick);
    this.dropDown.removeEventListener('click', this.#onClickItem);
    document.body.removeChild(this.dropDown);
    this.dropDown = null;
    this.suggestions = [];
  }

  onScroll = () => this.#updatePos();

  //filter the list of data and append a <ul> to the marker element to show to the end user
  #filterList = () => {
    if (!this.suggestions.length) return;
    
    const {selectionStart, value} = this.input;
    const filter = value.slice(this.editStart + 1, selectionStart).toLowerCase();

    const filteredSuggestions = this.suggestions.filter(entry => entry.toLowerCase().includes(filter));
    if (!filteredSuggestions.length) this.close();
    else {
      this.open();

      const suggestedList = document.createElement('ul');
      suggestedList.classList.add('suggestion-item');

      filteredSuggestions.forEach(entry => {
        const entryItem = document.createElement('li');
        entryItem.textContent = entry;
        suggestedList.appendChild(entryItem);
      });

      if (this.dropDown.firstChild) this.dropDown.replaceChild(suggestedList, this.dropDown.firstChild);
      else this.dropDown.appendChild(suggestedList);
    }
  };

  #onClick = evt => {
    //hide dropdown when clicking outside
    if (evt.target !== this.dropDown) this.close();
  };

  #onClickItem = e => {
    e.preventDefault();
    if (e.target.tagName === 'LI') {
      this.input.focus();
      this.#selectItem(e.target.textContent, true);
    }
  };

  //given a selected value, replace the special character and insert selected value
  #selectItem = (selected, click = false) => {
    const {selectionStart} = this.input;
    const start = this.input.value.slice(0, this.editStart);
    const end = this.input.value.slice(click ? selectionStart + 1 : selectionStart, this.input.value.length);
    this.input.value = `${start}${selected}${end}`;
    this.close();
  };

  //toggles selected item in list via arrow keys
  #toggleItem = (dir = 'next') => {
    const list = this.dropDown.querySelector('ul');

    if (!this.selectedItem) {
      //create a new selected item if one doesn't exist
      this.selectedItem = this.dropDown.querySelector('li');
      this.selectedItem.classList.add('suggestion-item--active');
    } else {
      //else update the selected item based on the given selection direction
      this.selectedItem.classList.remove('suggestion-item--active');
      let nextActive = this.selectedItem[`${dir}ElementSibling`];
      if (!nextActive && dir === 'next') nextActive = list.firstChild; else if (!nextActive) nextActive = list.lastChild;

      this.selectedItem = nextActive;
      nextActive.classList.add('suggestion-item--active');
    }
  };

  #updatePos = () => {
    const {offsetLeft, offsetTop, offsetHeight, offsetWidth, scrollLeft, scrollTop, selectionEnd} = this.input;
    const {lineHeight, paddingRight} = getComputedStyle(this.input);
    const {x, y} = getCaretXY(this.input, selectionEnd);

    const newLeft = Math.min(x - scrollLeft, offsetLeft + offsetWidth - parseInt(paddingRight, 10));
    const newTop = Math.min(y - scrollTop, offsetTop + offsetHeight - parseInt(lineHeight, 10));

    this.dropDown.style.top = `${newTop}px`;
    this.dropDown.style.left = `${newLeft}px`;
  }
}