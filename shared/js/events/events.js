import app from "@feathr/shared/js/core/app.js";

export function initEvents() {
  document.addEventListener('keydown', e => {
    // if (e.key.substring(0, 5) === 'Arrow') {
    //   setTimeout(() => app.update(), 0); // force the refresh event to happen after the selection updates
    //   return;
    // }
    
    //insert tab
    if (e.key === 'Tab' && app.editor.isFocused()) {
      //trap focus in the editor to not switch to the cmdBar inputs
      e.preventDefault();
      app.editor.insert.text("\t");
    }

    //slower refresh
    if (e.key === 'Enter' || e.key === 'Space')
      setTimeout(() => {
        app.dictionary.update();
        app.update();
      }, 16);
  });

  document.addEventListener('keyup', e => {
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
        app.editor.selection.set(cur_pos);
        app.editor.insert.text(indent);
      }
    }

    app.update();
  });
  
  document.addEventListener('click', e => {
    if (app.cmdBar.isOpen) return;
    app.stats.update();
    app.sidebar.update();
  });
}