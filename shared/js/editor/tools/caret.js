//based on: https://jh3y.medium.com/how-to-where-s-the-caret-getting-the-xy-position-of-the-caret-a24ba372990a
import {isMobile, getCaretXY} from "@feathr/shared/js/core/utils.js";
import app from "@feathr/shared/js/core/app.js";

export class Caret {
  isActive = false;
  
  init() {
    this.el = document.getElementById('caret');
    
    this.observer = new ResizeObserver(this.update.bind(this));
    this.observer.observe(app.editor.el);
  }
  
  show = () => this.#toggle(true);
  hide = () => this.#toggle(false);
  
  #toggle = (enable) => {
    if (!this.el) return;
    this.isActive = enable;
    this.el.classList.toggle('hidden', !enable);
    this.update();
  }

  onScroll = _ => {
    if (!this.el) return;
    //disable transitions while scrolling
    let prevTransition = this.el.style.transition;
    this.el.style.transition = "none";
    this.el.style.transition = prevTransition;
    this.#updatePos();
  }
  
  update = () => {
    if (!this.isActive) return;
    this.#updateSize();
    this.#updatePos();
  };

  #updateSize = () => {
    let height = app.settings.fontSize.storeVal();
    let width = height < 2 ? 2 : height < 3 ? 3 : 4;
    if (isMobile && width < 3) width = 3;
    
    this.el.style.width = `${width}px`;
    this.el.style.height = `${height}rem`;
  }
  
  #updatePos = () => {
    const {offsetLeft, offsetTop, offsetHeight, offsetWidth, scrollLeft, scrollTop, selectionEnd} = app.editor.el;
    const {lineHeight, paddingRight} = getComputedStyle(app.editor.el);
    let {x, y} = getCaretXY(app.editor.el, selectionEnd);

    let newLeft = Math.min(x - scrollLeft, offsetLeft + offsetWidth - parseInt(paddingRight, 10));
    let newTop = Math.min(y - scrollTop, offsetTop + offsetHeight - parseInt(lineHeight, 10));
    if (isMobile) newTop -= 1;

    this.el.style.top = `${newTop}px`;
    this.el.style.left = `${newLeft}px`;
  }
}