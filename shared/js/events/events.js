import app from "@leaf/shared/js/core/app.js";

export function initEvents() {
  document.onkeydown = async function keyDown(e) {
    // Reset index on space
    if (e.key === ' ' || e.key === 'Enter') app.editor.select.index = 0;

    if (e.key.substring(0, 5) === 'Arrow') {
      setTimeout(() => app.update(), 0); // force the refresh event to happen after the selection updates
      return;
    }

    // Slower Refresh
    if (e.key === 'Enter') setTimeout(() => {
      app.dictionary.update();
      app.update();
    }, 16);
  };

  document.onkeyup = (e) => {
    if (e.key === 'Enter' && app.settings.autoIndent.storeVal()) { // auto-indent
      let cur_pos = app.editor.el.selectionStart; // get new position in textarea

      // go back until beginning of last line and count spaces/tabs
      let indent = '';
      let line = '';
      for (let pos = cur_pos - 2; // -2 because of cur and \n
           pos >= 0 && app.editor.text().charAt(pos) !== '\n';
           pos--
      ) line += app.editor.text().charAt(pos);

      let matches;
      if ((matches = /^.*?([\s\t]+)$/gm.exec(line)) !== null) { // found indent
        indent = matches[1].split('').reverse().join(''); // reverse
        app.editor.el.selectionStart = cur_pos;
        app.editor.insert.text(indent);
      }
    }

    if (e.key !== 'Tab') app.update();
  };

  document.onclick = () => {
    if (app.cmdBar.is_active) return;
    
    app.editor.select.index = 0;
    app.update();
  };
}