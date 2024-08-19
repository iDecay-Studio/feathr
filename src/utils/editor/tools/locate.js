import {EOL} from "@tauri-apps/api/os";
import app from "@/utils/core/app.js";

export function Locate() {
  this.find = (word) => {
    const text = app.editor.el.value.toLowerCase()
    const parts = text.split(word.toLowerCase())
    const a = []
    let sum = 0

    for (const id in parts) {
      const p = parts[id].length
      a.push(sum + p)
      sum += p + word.length
    }

    a.splice(-1, 1)

    return a
  }
  
  this.active_word_location = (position = app.editor.el.selectionEnd) => {
    let from = position - 1

    // Find beginning of word
    while (from > -1) {
      const char = app.editor.el.value[from]
      if (!char || !char.match(/[a-z]/i)) break
      from -= 1
    }

    // Find end of word
    let to = from + 1
    while (to < from + 30) {
      const char = app.editor.el.value[to]
      if (!char || !char.match(/[a-z]/i)) break
      to += 1
    }

    from += 1

    return {from: from, to: to}
  }
  this.active_word = () => {
    const l = this.active_word_location()
    return app.editor.el.value.substr(l.from, l.to - l.from)
  }

  this.active_line_id = () => {
    const segments = app.editor.el.value.substr(0, app.editor.el.selectionEnd).split(EOL)
    return segments.length - 1
  }

  this.active_line = () => {
    const text = app.editor.el.value
    const lines = text.split(EOL)
    return lines[this.active_line_id()]
  }

  this.active_url = () => {
    const words = this.active_line().split(' ')
    for (const id in words) {
      if (words[id].indexOf('://') > -1 || words[id].indexOf('www.') > -1) return words[id]
    }
    return null
  }

  // this.prev_character = () => {
  //   const l = this.active_word_location()
  //   return app.editor.el.value.substr(l.from - 1, 1)
  // }
}