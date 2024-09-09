import {exec} from "@/shared/js/core/utils.js";
import app from "@/shared/js/core/app.js";

export class Insert {
  text = (characters) => {
    exec('insertText', characters);
    app.update();
  };
  // line = (characters = '__') => {
  //   app.editor.selection.line(app.editor.locate.active_line_id())
  //   this.text(characters)
  // }
  // multiline = (characters = '__') => {
  //   const lines = app.editor.selection.get().match(/[^\r\n]+/g)
  //   let text = ''
  //   for (const id in lines) {
  //     const line = lines[id]
  //     text += `${characters}${line}\n`
  //   }
  //   app.editor.replace.selection(text)
  // }
}