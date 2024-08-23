//based on: https://jh3y.medium.com/how-to-where-s-the-caret-getting-the-xy-position-of-the-caret-a24ba372990a
import {createMarker, getCaretXY} from "@/utils/core/utils.js";
import {app} from "@/utils/core/app.js";

export class Caret {
  constructor() {
    this.input = app.editor.el;
    this.isActive = false;
    this.el = null;
    
    this.observer = new ResizeObserver(this.update.bind(this));
    this.observer.observe(this.input);
  }

  onScroll = e => {
    //disable transitions while scrolling
    let prevTransition = this.el.style.transition;
    this.el.style.transition = "none";
    this.update(e);
    this.el.style.transition = prevTransition;
  }
  
  update = e => {
    const processClick = evt => {
      if (e !== evt && evt.target !== e.target) toggleMarker();
    };

    const toggleMarker = () => {
      this.isActive = !this.isActive;

      if (this.isActive && !this.el) {
        this.el = createMarker('', 'caret');
        document.body.appendChild(this.el);
        document.addEventListener('click', processClick);
      } else {
        document.body.removeChild(this.el);
        document.removeEventListener('click', processClick);
        this.el = null;
      }
    };
    
    if (!this.isActive) toggleMarker();
    if (this.isActive) this.#updatePos();
  };

  #updatePos = () => {
    const {offsetLeft, offsetTop, offsetHeight, offsetWidth, scrollLeft, scrollTop, selectionEnd} = this.input;
    const {lineHeight, paddingRight} = getComputedStyle(this.input);
    const {x, y} = getCaretXY(this.input, selectionEnd);

    const newLeft = Math.min(x - scrollLeft, offsetLeft + offsetWidth - parseInt(paddingRight, 10));
    const newTop = Math.min(y - scrollTop, offsetTop + offsetHeight - parseInt(lineHeight, 10));

    this.el.setAttribute('style', `left: ${newLeft}px; top: ${newTop}px`);
  }
}