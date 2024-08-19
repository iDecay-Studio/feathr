import {EOL} from "@tauri-apps/api/os";
import app from "@/utils/core/app.js";
import {clamp} from "@/utils/core/utils.js";

export function Go() {
  this.to_page();
  this.to_page = function (id = 0, line = 0) {
    app.project.index = clamp(parseInt(id), 0, app.project.pages.length - 1)
    // console.log(`Go to page:${app.project.index}/${app.project.pages.length}`)
    const page = app.project.page()

    if (!page) {
      console.warn('Missing page', this.index);
      return
    }

    app.load(page.text)
    app.go.to_line(line)
    app.update()
  }

  this.to_line = function (id) {
    const lineArr = app.editor.el.value.split(EOL, parseInt(id) + 1)
    const arrJoin = lineArr.join(EOL)
    const from = arrJoin.length - lineArr[id].length
    const to = arrJoin.length

    this.to(from, to)
  }

  this.to = function (from, to, scroll = true) {
    if (app.editor.el.setSelectionRange) app.editor.el.setSelectionRange(from, to)
    else if (app.editor.el.createTextRange) {
      const range = app.editor.el.createTextRange()
      range.collapse(true)
      range.moveEnd('character', to)
      range.moveStart('character', from)
      range.select()
    }
    app.editor.el.focus()

    if (scroll) this.scroll_to(from, to)

    return from === -1 ? null : from
  }

  this.to_next = function (str, scroll = true) {
    const ta = app.editor.el
    const text = ta.value
    const range = text.substr(ta.selectionStart, text.length - ta.selectionStart)
    const next = ta.selectionStart + range.indexOf(EOL)
    this.to(next, next, scroll)
  }

  this.scroll_to = function (from, to) {
    const textVal = app.editor.el.value
    const div = document.createElement('div')
    div.innerHTML = textVal.slice(0, to)
    document.body.appendChild(div)
    animateScrollTo(app.editor.el, div.offsetHeight - 60, 200)
    div.remove()
  }

  function animateScrollTo(element, to, duration) {
    const start = element.scrollTop
    const change = to - start
    let currentTime = 0
    const increment = 20 // Equal to line-height

    const animate = () => {
      currentTime += increment
      element.scrollTop = Math.easeInOutQuad(currentTime, start, change, duration)
      if (currentTime < duration) requestAnimationFrame(animate, increment)
    }
    requestAnimationFrame(animate)
  }

  // t = current time
  // b = start value
  // c = change in value
  // d = duration

  Math.easeInOutQuad = function (t, b, c, d) {
    t /= d / 2
    if (t < 1) return c / 2 * t * t + b
    t--
    return -c / 2 * (t * (t - 2) - 1) + b
  }
}