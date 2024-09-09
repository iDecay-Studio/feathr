import app from "@/shared/js/core/app.js";
import {exec} from "@/shared/js/core/utils.js";

export class Replace {
  active_word = (word) => {
    const l = app.editor.locate.active_word_location();
    const w = app.editor.text().substring(l.from, l.to);

    // Preserve capitalization
    if (w.substring(0, 1) === w.substring(0, 1).toUpperCase())
      word = word.substring(0, 1).toUpperCase() + word.substring(1);

    app.editor.selection.set(l.from, l.to);
    exec('insertText', word);
    app.editor.focus()
  };

  selection = (characters) => {
    exec('insertText', characters);
    app.update();
  };

  // // del is an optional arg for deleting the line, used in actions
  // line = (id, newText, del = false) => {
  //   const lineArr = app.editor.text().split(EOL, parseInt(id) + 1)
  //   const arrJoin = lineArr.join(EOL)
  //
  //   const from = arrJoin.length - lineArr[id].length
  //   const to = arrJoin.length
  //
  //   // splicing the string
  //   const newTextValue = app.editor.text().slice(0, del ? from - 1 : from) + newText + app.editor.text().slice(to)
  //
  //   // the cursor automatically moves to the changed position, so we have to set it back
  //   let cursorStart = app.editor.el.selectionStart
  //   let cursorEnd = app.editor.el.selectionEnd
  //   const oldLength = app.editor.text().length
  //   const oldScroll = app.editor.el.scrollTop
  //   // setting text area
  //   app.load(newTextValue)
  //   // adjusting the cursor position for the change in length
  //   const lengthDif = app.editor.text().length - oldLength
  //   if (cursorStart > to) {
  //     cursorStart += lengthDif
  //     cursorEnd += lengthDif
  //   }
  //   // setting the cursor position
  //   app.editor.selection.set(cursorStart, cursorEnd);
  //
  //   // setting the scroll position
  //   app.editor.el.scrollTop = oldScroll
  // }
}