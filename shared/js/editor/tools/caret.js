//based on: https://jh3y.medium.com/how-to-where-s-the-caret-getting-the-xy-position-of-the-caret-a24ba372990a
import {getCaretXY, isMobile} from "@feathr/shared/js/core/utils.js";
import app from "@feathr/shared/js/core/app.js";

export class Caret {
  isActive = false;
  el = null;
  
  init() {
    this.observer = new ResizeObserver(this.update.bind(this));
    this.observer.observe(app.editor.el);
  }

  onScroll = e => {
    if (!this.el) return;
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
        this.el = document.createElement('div');
        this.el.classList.add("caret");
        this.el.textContent = "";
        
        document.body.appendChild(this.el);
        this.updateSize();
        document.addEventListener('click', processClick);
      } else {
        document.body.removeChild(this.el);
        document.removeEventListener('click', processClick);
        this.el = null;
      }
    };
    
    if (!this.isActive) toggleMarker();
    this.updatePos();
  };

  updateSize = () => {
    if (!this.el) return;
    
    let height = app.settings.fontSize.storeVal();
    let width = height < 2 ? 2 : height < 3 ? 3 : 4;
    if (isMobile && width < 3) width = 3;
    
    this.el.style.width = `${width}px`;
    this.el.style.height = `${height}rem`;
  }
  
  updatePos = () => {
    if (!this.el || !this.isActive) return;
    if (app.editor.el === null) return;

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