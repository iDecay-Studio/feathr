import {app} from "@/utils/core/app.js";

export class Highlighter {
  constructor() {
    this.backdrop = document.getElementById('backdrop');
    this.highlights = document.getElementById('highlights');
    this.textarea = app.editor.el;
    
    this.searchArg = '';
    this.sensitive = false;
    this.sel = -1;
    this.clear();
    
    let ua = window.navigator.userAgent.toLowerCase();
    this.isIE = !!ua.match(/msie|trident\/7|edge/);

    this.observer = new ResizeObserver(this.onResize.bind(this));
    this.observer.observe(this.textarea);
    
    this.onInput();
    
    document.addEventListener('keydown', e => {
      //bring backdrop to front for clicking on link markers
      if (e.ctrlKey) this.#setBackdropZPos(3);
    });
    
    document.addEventListener('keyup', () => this.#setBackdropZPos());
  }
  
  #setBackdropZPos = (id = 1) => this.backdrop.style.zIndex = id; 

  onInput = () => {
    this.highlights.innerHTML = this.#markText();
    this.onScroll();
    if (this.sel > -1) this.#setSelection();
  }

  onScroll() {
    this.backdrop.scrollTop = this.textarea.scrollTop || 0;
    this.backdrop.scrollLeft = this.textarea.scrollLeft || 0;

    // let sclLeft = this.textarea.scrollLeft;
    // this.backdrop.style.transform = (sclLeft > 0) ? `translateX(${-sclLeft}px)` : '';
  }

  onResize() {
    let styles = window.getComputedStyle(this.textarea);
    let width = this.textarea.scrollWidth;
    let height = this.textarea.offsetHeight;

    this.backdrop.style.cssText = `width: ${width}px; height: ${height}px; margin: ${styles.marginTop} ${styles.marginRight} ${styles.marginBottom} ${styles.marginLeft}`;
    this.#copyStyles(this.textarea, this.highlights, ['width', 'paddingLeft', 'paddingRight', 'paddingTop', 'paddingBottom', 'borderTop', 'letterSpacing', 'borderLeft', 'borderRight', 'borderBottom', 'fontFamily', 'fontSize', 'fontWeight', 'lineHeight']);
    this.highlights.style.minHeight = styles.height;
    this.highlights.style.whiteSpace = 'pre-wrap';
  }

  search(arg, sensitive, word) {
    this.searchArg = arg;
    this.sensitive = !!sensitive;
    this.word = !!word;
    this.onInput();
    this.sel = -1;
    this.next();
  }

  next() {
    this.sel += 1;
    this.#setSelection(true);
  }

  prev() {
    this.sel -= 1;
    this.#setSelection(true);
  }

  count = () => this.highlights.querySelectorAll('mark').length;

  clear() {
    this.highlights.innerHTML = this.highlights.textContent;
    this.searchArg = '';
    this.sel = -1;
  }
  
  #markText() {
    let text = this.textarea.value.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    text = text.replace(/\n$/g, '\n\n');

    if (this.searchArg) {
      let searchArg = this.searchArg.replace(/</g, '&lt;').replace(/>/g, '&gt;');
      let boundary = this.word ? '\\b' : '';

      let regExSearch = new RegExp(`${boundary}(${this.#escapeString(searchArg)})${boundary}`, `g${this.sensitive ? '' : 'i'}`);
      text = text.replace(regExSearch, '<mark>$&</mark>');

      // IE wraps whitespace differently in a div vs textarea, this fixes it
      if (this.isIE) text = text.replace(/ /g, ' <wbr>');
    }

    text = text.replace(/(https:|http:|ftp:|www\.)\S*/gm, '<a href="$&" class="link">$&</a>')
    text = text.replace(/[^\s@]+@[^\s@]+\.[^\s@]+/gm, '<a href="mailto:$&" class="email">$&</a>');
    text = text.replace(/(\/\/[^\n\r]*)/gm, '<p class="comment">$&</p>');

    return text;
  }

  #escapeString(txt) {
    let specials = ['-', '[', ']', '/', '{', '}', '(', ')', '*', '+', '?', '.', '\\', '^', '$', '|'];
    return txt.replace(RegExp(`[${specials.join('\\')}]`, 'g'), '\\$&');
  }

  #copyStyles(src, dest, copyStyles) {
    let styles = window.getComputedStyle(src);
    copyStyles.forEach((stl) => dest.style[stl] = styles[stl]);
  }

  #setSelection(scroll = false) {
    let nodes = this.highlights.querySelectorAll('mark');
    let len = nodes.length;

    if (this.sel >= len) this.sel = 0;
    if (this.sel < 0) this.sel = len - 1;

    for (let i = 0; i < len; ++i) {
      if (i === this.sel) {
        nodes[i].classList.add('sel');
        if (scroll) this.textarea.scrollTop = nodes[i].offsetTop > 10 ? nodes[i].offsetTop - 10 : nodes[i].offsetTop;
      } else nodes[i].classList.remove('sel');
    }
  }
}