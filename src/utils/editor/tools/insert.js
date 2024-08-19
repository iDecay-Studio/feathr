import {exec} from "@/utils/core/utils.js";
import {app} from "@/utils/core/app.js";

export function Insert() {
  this.text = (characters = '__') => {
    const pos = app.editor.el.selectionStart;
    app.editor.el.setSelectionRange(pos, pos);
    exec('insertText', characters);
    app.update();
  };
  // this.line = (characters = '__') => {
  //   app.editor.select.line(app.editor.locate.active_line_id())
  //   this.text(characters)
  // }
  // this.multiline = (characters = '__') => {
  //   const lines = app.editor.selection.get().match(/[^\r\n]+/g)
  //   let text = ''
  //   for (const id in lines) {
  //     const line = lines[id]
  //     text += `${characters}${line}\n`
  //   }
  //   app.editor.replace.selection(text)
  // }
}