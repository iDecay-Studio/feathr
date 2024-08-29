import {app} from "@leaf/shared/utils/core/app.js";
import {exec} from "@leaf/shared/utils/core/utils.js";

export function Replace() {
  this.active_word = (word) => {
    const l = app.editor.locate.active_word_location();
    const w = app.editor.el.value.substring(l.from, l.to - l.from);

    // Preserve capitalization
    if (w.substring(0, 1) === w.substring(0, 1).toUpperCase()) {
      word = word.substring(0, 1).toUpperCase() + word.substring(1, word.length);
    }

    app.editor.el.setSelectionRange(l.from, l.to);
    exec('insertText', word);
    app.editor.el.focus();
  };

  this.selection = (characters) => {
    exec('insertText', characters);
    app.update();
  };

  // del is an optional arg for deleting the line, used in actions
  // this.line = (id, newText, del = false) => {
  //   const lineArr = app.editor.el.value.split(EOL, parseInt(id) + 1)
  //   const arrJoin = lineArr.join(EOL)
  //
  //   const from = arrJoin.length - lineArr[id].length
  //   const to = arrJoin.length
  //
  //   // splicing the string
  //   const newTextValue = app.editor.el.value.slice(0, del ? from - 1 : from) + newText + app.editor.el.value.slice(to)
  //
  //   // the cursor automatically moves to the changed position, so we have to set it back
  //   let cursorStart = app.editor.el.selectionStart
  //   let cursorEnd = app.editor.el.selectionEnd
  //   const oldLength = app.editor.el.value.length
  //   const oldScroll = app.editor.el.scrollTop
  //   // setting text area
  //   app.load(newTextValue)
  //   // adjusting the cursor position for the change in length
  //   const lengthDif = app.editor.el.value.length - oldLength
  //   if (cursorStart > to) {
  //     cursorStart += lengthDif
  //     cursorEnd += lengthDif
  //   }
  //   // setting the cursor position
  //   if (app.editor.el.setSelectionRange) {
  //     app.editor.el.setSelectionRange(cursorStart, cursorEnd)
  //   } else if (app.editor.el.createTextRange) {
  //     const range = app.editor.el.createTextRange()
  //     range.collapse(true)
  //     range.moveEnd('character', cursorEnd)
  //     range.moveStart('character', cursorStart)
  //     range.select()
  //   }
  //   // setting the scroll position
  //   app.editor.el.scrollTop = oldScroll
  // }
}