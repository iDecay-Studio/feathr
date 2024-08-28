import {debounce} from "./utils.js";
import {showSidebar} from "./stores.js";

//based on: https://codepen.io/maves9/pen/qBqERPE
export class DragMenu {
  isOpen   = false;
  isMoving = false;
  dragOpen = false;
  
  constructor(menuEl) {
    this.menu = menuEl;

    let min = parseInt(window.getComputedStyle(this.menu).left);
    this.position = {current: min, min: min, max: 0};
    this.position.snapBorder = (this.position.min + this.position.max) * 0.35;

    this.hasTouch = 'ontouchstart' in window;
    this.eventStart  = this.hasTouch ? 'touchstart' : 'mousedown';
    this.eventMove = this.hasTouch ? 'touchmove' : 'mousemove';
    this.eventEnd  = this.hasTouch ? 'touchend' : 'mouseup';

    this.menu.addEventListener(this.eventStart, e => {
      this.updateCurrentPos(e);
      this.menu.style.pointerEvents = 'none';
    });

    //start swiping the sidebar in if not currently open
    window.addEventListener(this.eventStart, e => {
      if (this.isOpen) return;
      this.updateCurrentPos(e);
      this.dragOpen = this.getEvent(e, 'touchstart').clientX < 50;
    });

    window.addEventListener(this.eventMove, debounce(e => {
      if (!this.dragOpen && this.menu.style.pointerEvents !== 'none') return;

      let move = this.getEvent(e, 'touchmove').clientX - this.position.current;
      
      if (move >= this.position.min && move <= this.position.max) {
        this.menu.classList.add('is-moving');
        this.isMoving = true;
        this.menu.style.left = `${move}px`;
      }
    }));

    window.addEventListener(this.eventEnd, e => {
      if (this.isMoving) {
        let l = parseInt(this.menu.style.left);
        this.setOpen(l > this.position.snapBorder);
      }
      
      this.isMoving = false;
      this.dragOpen = false;
      this.menu.classList.remove('is-moving');
      
      this.menu.style.left = null;
      this.menu.style.pointerEvents = 'initial';
    });
  }
  
  updateCurrentPos = (e) => this.position.current = Math.abs(this.menu.offsetLeft - this.getEvent(e, 'touchstart').clientX);
  getEvent = (e, checkFor) => e.type === checkFor ? e.changedTouches[0] : e;

  setOpen = isOpen => {
    this.isOpen = isOpen;
    this.menu.classList[isOpen ? 'add' : 'remove']('open')
    showSidebar.set(isOpen);
  }
}