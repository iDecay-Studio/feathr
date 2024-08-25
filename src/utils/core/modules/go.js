import {app} from "@/utils/core/app.js";
import {clamp, EOL} from "@/utils/core/utils.js";

export class Go {
  init = async () => {
    this.to_page();
  }
  
  to_page = (id = 0, line = 0) => {
    app.project.index = clamp(parseInt(id), 0, app.project.pages.length - 1);
    // console.log(`Go to page:${app.project.index}/${app.project.pages.length}`)
    const page = app.project.page();

    if (!page) {
      console.warn('Missing page', this.index);
      return;
    }

    app.load(page.text);
    app.go.to_line(line);
    app.update();
  };

  to_line = (id) => {
    const lineArr = app.editor.el.value.split(EOL, parseInt(id) + 1);
    const arrJoin = lineArr.join(EOL);
    const from = arrJoin.length - lineArr[id].length;
    const to = arrJoin.length;

    this.to(from, to);
  };

  to = (from, to, scroll = true) => {
    if (scroll) this.scroll_to(from, to);

    if (app.editor.el.setSelectionRange) app.editor.el.setSelectionRange(from, to);
    else if (app.editor.el.createTextRange) {
      const range = app.editor.el.createTextRange();
      range.collapse(true);
      range.moveEnd('character', to);
      range.moveStart('character', from);
      range.select();
    }

    return from === -1 ? null : from;
  };

  // to_next = (str, scroll = true) => {
  //   const ta = app.editor.el;
  //   const text = ta.value;
  //   const range = text.substring(ta.selectionStart, text.length - ta.selectionStart);
  //   const next = ta.selectionStart + range.indexOf(EOL);
  //   this.to(next, next, scroll);
  // };

  scroll_to = (from, to) => {
    const textVal = app.editor.el.value
    const div = document.createElement('div')
    div.innerHTML = textVal.slice(0, to)
    document.body.appendChild(div)
    this.animateScrollTo(app.editor.el, div.offsetHeight - 60, 200)
    div.remove()
    
    //---
    // //cache current text-area state
    // const ta = app.editor.el;
    // const text = ta.value;
    // const sliceText = text.slice(0, to);
    // const scrollFrom = ta.scrollTop;
    // const taPaddingTop = 30;
    //
    // // Textarea hack to get the proper scroll position of the selection
    // // This relies on textarea behavior where it scrolls to the bottom when focused
    // ta.scrollTop = 0;
    // ta.blur();
    // ta.style.paddingTop = `${ta.clientHeight}px`;
    // ta.value = sliceText;
    // ta.focus();
    // ta.style.paddingTop = `${taPaddingTop}px`;
    // ta.value = text;
    //
    // // Reset scroll position and scroll to new position
    // ta.scrollTop = scrollFrom;
    // this.animateScrollTo(ta, ta.scrollTop - 60, 200);
  };

  animateScrollTo = (element, to, duration) => {
    const start = element.scrollTop;
    const change = to - start;
    let currentTime = 0;
    const increment = 20; // Equal to line-height

    const animate = () => {
      currentTime += increment;
      element.scrollTop = this.easeInOutQuad(currentTime, start, change, duration);
      if (currentTime < duration) requestAnimationFrame(animate, increment);
    };
    requestAnimationFrame(animate);
  }

  // t = current time; b = start value; c = change in value; d = duration
  easeInOutQuad = (t, b, c, d) => {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t + b;
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
  };
}