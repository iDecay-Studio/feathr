import {app} from "@shared/utils/core/app.js";
import {EOL} from "@shared/utils/core/utils.js";
import {get, writable} from "svelte/store";

export const currCmd = writable("");
export const gotoCmd = "goto";
export const findCmd = "find";
export const replaceCmd = "replace";

//opens a bar at the bottom for various actions like find&replace, goto line, ...
export class CmdBar {
  init = async () => {
    this.el = document.getElementById('cmdBar');
    this.input = document.getElementById('cmdBar-search');
    this.is_active = false;
    this.prev = []; //list of previous inputs
    this.index = 0;
  }

  open = (cmd) => {
    this.is_active = true;
    app.stats.el.classList.add('hidden');
    currCmd.set(cmd);
    
    this.input.value = "";
    this.input.focus();

    let input2 = document.getElementById('cmdBar-replace');
    if (input2) input2.value = "";

    this.update();
    app.update();
  };

  update = () => {
    this.el.classList.toggle('active', this.is_active);
    if (!this.is_active) return;

    this.runCmd(true);
  };

  close = () => {
    if (!this.is_active) return;
    this.is_active = false;
    app.stats.el.classList.remove('hidden');

    app.editor.el.focus();

    this.update();
    app.update();
    app.editor.highlighter.clear()
  };

  on_change = (e, down = false) => {
    if (!this.is_active) return;

    if (e.key === 'ArrowUp' && down) {
      this.index--;
      if (this.index < 0) this.index = this.prev.length-1;
      this.input.value = this.prev[this.index];
      e.preventDefault();
      return;
    }

    if (!down && (e.key === 'Enter' || e.code === 'Enter')) {
      this.runCmd(false);
      e.preventDefault();
    } else if (!down) this.runCmd(true);
  };

  runCmd = (passive) => {
    let cmd = get(currCmd);
    let input = this.input.value;
    
    if (cmd === gotoCmd) this.goto(input, !passive);
    else if (cmd === findCmd) this.find(input, !passive);
    else if (cmd === replaceCmd) this.replace(input, !passive);
  };

  goto = (input, run) => {
    const target = parseInt(input, 10);
    const linesCount = app.editor.el.value.split(EOL).length - 1;
    if (input === '' || target < 1 || target > linesCount || Number.isNaN(target)) return;

    if (run) {
      this.close();
      app.go.to_line(target);
    }
  };

  find = (input, run, all = false) => {
    // if (input.length < 3) return;

    const results = app.editor.locate.find(input);
    if (results.length < 1) return;

    const from = app.editor.el.selectionStart;
    let result = 0;
    
    for (const id in results) {
      result = results[id];
      if (result > from) break;
    }

    // Found final occurrence, start from the top
    if (result === app.editor.el.selectionStart) {
      app.editor.el.setSelectionRange(0, 0);
      this.find(input, true);
      return;
    }

    if (run && result) {
      if (!this.prev.includes(input)) {
        this.prev.push(input);
        this.index = this.prev.length-1;
      }
      app.go.to(result, result + input.length);
      app.cmdBar.close();
    }
  };

  replace = (input, run, all = false) => {
    const a = input;
    const b = document.getElementById('cmdBar-replace').value;

    const results = app.editor.locate.find(a);
    if (results.length < 1) return;

    const from = app.editor.el.selectionStart;
    let result = 0;
    
    for (const id in results) {
      result = results[id];
      if (result > from) break;
    }

    if (run) {
      app.go.to(result, result + a.length);
      app.editor.replace.selection(b);
    }
  };
}