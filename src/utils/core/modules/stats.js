import {get} from "svelte/store";
import app from "@/utils/core/app.js";
import {startingState, textEdited} from "@/utils/_trash/states.js";
import {EOL} from "@tauri-apps/api/os";
import {clamp} from "@/utils/core/utils.js";

export function calculateStats() {
  const lines = app.editor.el.value.split(/\r|\r\n|\n/).length;
  const words = app.editor.el.value.trim().replace("\n", " ").split(/(\s+)/).filter((word) => word.trim().length > 0).length;
  const chars = app.editor.el.value.replace("\n", "").replace(" ", "").length;

  const lineSuffix = lines === 1 ? "line" : "lines";
  const wordSuffix = words === 1 ? "word" : "words";
  const charSuffix = chars === 1 ? "char" : "chars";

  app.stats.el.innerText = `${lines} ${lineSuffix} | ${words} ${wordSuffix} | ${chars} ${charSuffix}`;
  textEdited.set(app.editor.el.value !== get(startingState));
}

export function Stats () {
  this.el = document.getElementById('stats')

  this.update = function () {
    if (app.insert.is_active) {
      this.el.innerHTML = app.insert.status()
      return
    }

    if (app.editor.el.selectionStart !== app.editor.el.selectionEnd) this.el.innerHTML = this._selection()
    else if (app.editor.synonyms) {
      this.el.innerHTML = ''
      this.el.appendChild(this._synonyms())
    }
    else if (app.editor.select.word && app.editor.suggestion) this.el.innerHTML = this._suggestion()
    else if (app.editor.select.url) this.el.innerHTML = this._url()
    else this.el.innerHTML = this._default()
  }

  this._default = () => {
    const stats = this.parse(app.editor.selection())
    const date = new Date()
    
    const sep = ", ";
    const lineSuffix = stats.l === 1 ? "line" : "lines";
    const wordSuffix = stats.w === 1 ? "word" : "words";
    const charSuffix = stats.c === 1 ? "char" : "chars";
    
    return `${stats.l}${lineSuffix}${sep}${stats.w}${wordSuffix} (${stats.v} unique)${sep}${stats.c}${charSuffix}${sep}${stats.p}% <span class='right'>${date.getHours()}:${('0' + date.getMinutes()).slice(-2)}</span>`
  }

  this.incrementSynonym = () => {
    app.editor.select.index = (app.editor.select.index + 1) % app.editor.synonyms.length
  }

  this.list = null
  this.isSynonymsActive = false

  this.nextSynonym = () => {
    this.isSynonymsActive = true

    // Save the previous word element
    const previousWord = this.list.children[app.editor.select.index]

    // Increment the index
    this.incrementSynonym()

    // Get the current word element, add/remove appropriate active class
    const currentWord = this.list.children[app.editor.select.index]
    previousWord.classList.remove('active')
    currentWord.classList.add('active')

    currentWord.scrollIntoView({behavior: 'smooth'})
  }

  this.applySynonym = () => {
    if (!this.isSynonymsActive) return;

    // Replace the current word with the selected synonym
    app.editor.replace.active_word(app.editor.synonyms[app.editor.select.index % app.editor.synonyms.length])
  }

  this._synonyms = () => {
    app.editor.select.index = 0
    const ul = document.createElement('ul')

    app.editor.synonyms.forEach((syn) => {
      const li = document.createElement('li')
      li.textContent = syn
      ul.appendChild(li)
    })

    ul.children[0].classList.add('active')
    this.el.scrollLeft = 0
    this.list = ul

    return ul
  }

  this._suggestion = () => `<t>${app.editor.select.word}<b>${app.editor.suggestion.substr(app.editor.select.word.length, app.editor.suggestion.length)}</b></t>`
  this._selection = () => `<b>[${app.editor.el.selectionStart},${app.editor.el.selectionEnd}]</b> ${this._default()}`

  this._url = () => {
    const date = new Date()
    return `Open <b>${app.editor.select.url}</b> with &lt;c-b&gt; <span class='right'>${date.getHours()}:${date.getMinutes()}</span>`
  }
  
  this.parse = function (text = app.editor.el.value) {
    text = text.length > 5 ? text.trim() : app.editor.el.value

    const h = {}
    const words = text.toLowerCase().replace(/[^a-z0-9 ]/g, '').split(' ')
    for (const id in words) h[words[id]] = 1

    const stats = {}
    stats.l = text.split(EOL).length // lines_count
    stats.w = text.split(' ').length // words_count
    stats.c = text.length // chars_count
    stats.v = Object.keys(h).length
    stats.p = stats.c > 0 ? clamp((app.editor.el.selectionEnd / stats.c) * 100, 0, 100).toFixed(2) : 0
    return stats
  }
}