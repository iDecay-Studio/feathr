import app from "@/utils/core/app.js";
import {EOL} from "@tauri-apps/api/os";

//opens a bar at the bottom for various actions like find&replace, goto line, ...
export function Operator() {
  this.el = document.getElementById('operator');
  this.is_active = false
  this.index = 0

  this.el.addEventListener('keyup', (e) => { app.operator.on_change(e, false) })
  this.el.addEventListener('keydown', (e) => { app.operator.on_change(e, true) })

  this.open = function (f = '') {
    app.controller.set('operator')
    this.is_active = true

    app.editor.el.blur()
    this.el.value = f
    this.el.focus()

    this.update()
    app.update()
  }

  this.update = () => {
    this.el.className = this.is_active ? 'active' : 'inactive'
    if (!this.is_active) return;

    this.passive()
  }

  this.close = () => {
    if (!this.is_active) return;

    app.controller.set('default')
    this.is_active = false

    this.el.value = ''
    this.el.blur()
    app.editor.el.focus()

    this.update()
    app.update()
  }

  this.on_change = function (e, down = false) {
    if (!this.is_active) return;

    if (e.key === 'ArrowUp' && down) {
      this.el.value = this.prev
      e.preventDefault()
      return
    }

    if (!down && (e.key === 'Enter' || e.code === 'Enter')) {
      this.active()
      e.preventDefault()
    } else if (!down) {
      this.passive()
    }
  }

  this.passive = () => {
    if (this.el.value.indexOf(' ') < 0) return;

    const cmd = this.el.value.split(' ')[0].replace(':', '').trim()
    const params = this.el.value.replace(cmd, '').replace(':', '').trim()

    if (!this[cmd]) { console.info(`Unknown command ${cmd}.`); return }

    this[cmd](params)
  }

  this.active = () => {
    if (this.el.value.indexOf(' ') < 0) return;

    this.prev = this.el.value

    const cmd = this.el.value.split(' ')[0].replace(':', '').trim()
    const params = this.el.value.replace(cmd, '').replace(':', '').trim()

    if (!this[cmd]) { console.info(`Unknown command ${cmd}.`); return }

    this[cmd](params, true)
  }

  this.find_next = () => {
    if (!this.prev || !this.prev.includes('find:')) return;
    const word = this.prev.replace('find:', '').trim()

    // Find next occurrence
    this.find(word, true)
  }

  this.find = function (q, bang = false) {
    if (q.length < 3) return;

    const results = app.editor.locate.find(q)

    if (results.length < 1) return;

    const from = app.editor.el.selectionStart
    let result = 0
    for (const id in results) {
      result = results[id]
      if (result > from) { break }
    }

    // Found final occurrence, start from the top
    if (result === app.editor.el.selectionStart) {
      app.editor.el.setSelectionRange(0, 0)
      this.find(q, true)
      return
    }

    if (bang && result) {
      app.go.to(result, result + q.length)
      setTimeout(() => { app.operator.close() }, 250)
    }
  }

  this.replace = function (q, bang = false) {
    if (q.indexOf('->') < 0) return;

    const a = q.split('->')[0].trim()
    const b = q.split('->')[1].trim()

    if (a.length < 3) return;
    if (b.length < 3) return;

    const results = app.editor.locate.find(a)

    if (results.length < 1) return;

    const from = app.editor.el.selectionStart
    let result = 0
    for (const id in results) {
      result = results[id]
      if (result > from) { break }
    }

    if (bang) {
      app.go.to(result, result + a.length)
      setTimeout(() => { app.editor.replace.selection(b) }, 500)
      this.close()
    }
  }

  this.goto = function (q, bang = false) {
    const target = parseInt(q, 10)

    const linesCount = app.editor.el.value.split(EOL).length - 1

    if (q === '' || target < 1 || target > linesCount || Number.isNaN(target)) {
      return
    }

    if (bang) {
      this.close()
      app.go.to_line(target)
    }
  }
}