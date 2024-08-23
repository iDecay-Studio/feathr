import {app} from "@/utils/core/app.js";
import {EOL} from "@/utils/core/utils.js";
import {get, writable} from "svelte/store";

export const currCmd = writable("");
export const gotoCmd = "goto";
export const findCmd = "find";
export const replaceCmd = "replace";

//opens a bar at the bottom for various actions like find&replace, goto line, ...
export class CmdBar {
  init = async () => {
    this.el = document.getElementById('cmdBar');
    this.prefix = document.getElementById('cmdBar-prefix');
    this.input = document.getElementById('cmdBar-input');
    this.is_active = false;
    this.prev = []; //list of previous inputs
    this.index = 0;
  }

  open = (cmd) => {
    this.is_active = true;
    app.stats.el.classList.add('hide');
    currCmd.set(cmd);
    
    this.input.value = "";
    this.input.focus();

    let input2 = document.getElementById('cmdBar-input2');
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
    app.stats.el.classList.remove('hide');

    app.editor.el.focus();

    this.update();
    app.update();
  };

  on_change = (e, down = false) => {
    if (!this.is_active) return;

    if (e.key === 'ArrowUp' && down) {
      this.input.value = this.prev;
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
      app.go.to(result, result + input.length);
      app.cmdBar.close();
    }
  };

  replace = (input, run, all = false) => {
    const a = input;
    const b = document.getElementById('cmdBar-input2').value;

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