import app from "@/shared/js/core/app.js";

export class Selection {
  start = () => app.editor.el.selectionStart;
  end = () => app.editor.el.selectionEnd;
  
  get = () => app.editor.text().substring(this.start(), this.end());
  set = (from, to) => app.editor.el.setSelectionRange(from, to ?? from);
  reset = () => this.set(0);
  
  //clamp the selection to the length of the text
  clamp = () => {
    let selEnd = app.editor.el.selectionEnd;
    if (selEnd > app.editor.text().length) this.set(selEnd);
  }

  word = () => {
    let selection = this.get().trim();
    return selection.length ? selection : app.editor.locate.active_word();
  }
  nextChar = () => app.editor.text().slice(this.end(), this.end()+1);

  // word = (target) => {
  //   const from = app.editor.text().split(target)[0].length
  //   this.set(from, from + target.length)
  // }
  // line = (id) => {
  //   const lineArr = app.editor.text().split(EOL, parseInt(id) + 1)
  //   const arrJoin = lineArr.join(EOL)
  //
  //   const from = arrJoin.length - lineArr[id].length
  //   const to = arrJoin.length
  //
  //   this.set(from, to)
  // }
}