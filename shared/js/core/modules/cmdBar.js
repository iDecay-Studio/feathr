import app from "@feathr/shared/js/core/app.js";
import {EOL} from "@feathr/shared/js/core/utils.js";
import {get, writable} from "svelte/store";
import {tick} from "svelte";
import {format, unwrapFunctionStore} from 'svelte-i18n';

const _ = unwrapFunctionStore(format);

export const currCmd = writable("");
export const gotoCmd = "goto";
export const findCmd = "find";
export const replaceCmd = "replace";

//opens a bar at the bottom for various actions like find & replace, goto line, ...
export class CmdBar {
  isOpen = false;
  prev = []; //list of previous inputs
  index = -1; //prev. input id
  
  init = () => {
    this.el = document.getElementById('cmdBar');
    this.inputSearch = document.getElementById('inputSearch');
    this.inputReplace = document.getElementById('inputReplace');
    this.counterEl = document.getElementById('count');
    this.prevEl = document.getElementById('btnPrev');
    this.nextEl = document.getElementById('btnNext');
    this.clearEl = document.getElementById('btnClear');
    this.replaceAllEl = document.getElementById('btnReplaceAll');
  }

  open = (cmd) => {
    app.stats.el?.classList.add('hidden');
    this.el.classList.remove(gotoCmd, findCmd, replaceCmd);
    this.el.classList.add(cmd, "active");
    this.isOpen = true;
    this.index = -1;
    currCmd.set(cmd);

    this.clear();
    // app.update();
    app.editor.highlighter.update();
  };

  clear() {
    app.editor.highlighter.clear();
    this.inputReplace.value = '';
    this.inputSearch.value = '';
    this.inputSearch.focus();
    this.update();
  }

  close = () => {
    if (!this.isOpen) return;
    this.isOpen = false;

    this.el.classList.remove('active');
    app.stats.el?.classList.remove('hidden');
    app.editor.focus();

    this.update();
    app.editor.highlighter.clear();
  };

  update = () => {
    let goto = get(currCmd) === gotoCmd;

    let countVal = app.editor.highlighter.count();
    this.counterEl.textContent = countVal + " " + _("cmdBar.found");
    let hasSearchVal = app.cmdBar.inputSearch.value.length > 0;

    this.clearEl.classList.toggle('hidden', goto || !hasSearchVal);
    this.replaceAllEl.classList.toggle('hidden', goto || !hasSearchVal || !(get(currCmd) === replaceCmd));
    this.counterEl.classList.toggle('hidden', goto);
    this.prevEl.classList.toggle('hidden', goto || countVal === 0);
    this.nextEl.classList.toggle('hidden', goto || countVal === 0);
  };
  
  onSearchInput() {
    if (get(currCmd) === gotoCmd) return;

    app.editor.highlighter.search(this.inputSearch.value);
    this.update();
  }

  onKeyPress = (e, down = false) => {
    if (!this.isOpen) return;

    if (down && this.prev.length > 0 && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
      this.#onArrowKey(e.key === 'ArrowUp');
      e.preventDefault();
    }
    else if (!down && (e.key === 'Enter' || e.code === 'Enter')) {
      this.runCmd(false, e.shiftKey);
      e.preventDefault();
    }
  };
  
  #onArrowKey(arrowUp) {
    if (get(currCmd) === gotoCmd) return;
    
    this.index = this.index + (arrowUp ? 1 : -1);
    if (this.index > this.prev.length-1) this.index = 0;
    else if (this.index < 0) this.index = this.prev.length-1;
    
    this.inputSearch.value = this.prev[this.index];
    app.editor.highlighter.search(this.inputSearch.value);
  }

  runCmd = (all = false, reverse = false) => {
    let cmd = get(currCmd);
    let searchVal = this.inputSearch.value;
    if (!this.prev.includes(searchVal)) this.prev.push(searchVal);
    
    if (cmd === gotoCmd) this.goto(searchVal);
    else if (cmd === findCmd) this.find(reverse);
    else if (cmd === replaceCmd) this.replace(searchVal, all);
    
    this.update();
  };

  goto = (input) => {
    const target = parseInt(input, 10)-1;
    const linesCount = app.editor.text().split(EOL).length - 1;
    
    if (input === '' || input < 1 || target > linesCount || Number.isNaN(target)) return;

    this.close();
    app.go.to_line(target, false);
  };

  find = (reverse) => {
    if (reverse) app.editor.highlighter.prev();
    else app.editor.highlighter.next();
  }
  
  replace = (input, all = false) => {
    const replaceVal = this.inputReplace.value;
    
    if (!all) {
      app.editor.replace.selection(replaceVal);
      return;
    }
    
    const results = app.editor.locate.find(input);
    results.forEach(async result => {
      app.go.to(result, result + input.length);
      await tick();
      app.editor.replace.selection(replaceVal);
    });
  };
}