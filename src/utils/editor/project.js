import {Page} from "@/utils/editor/page.js";
import app from "@/utils/core/app.js";
import {fs} from "fs";
import {discardPrompt} from "@/utils/ui/prompts.js";
import {isJSON} from "@/utils/core/utils.js";

export function Project() {
  this.pages = []

  this.index = 0
  this.original = ''

  // Load previous files
  if (localStorage.hasOwnProperty('paths')) {
    if (isJSON(localStorage.getItem('paths'))) {
      const paths = JSON.parse(localStorage.getItem('paths'))
      for (const id in paths) this.add(paths[id])
    }
  }

  if (this.pages.length === 0) {
    this.pages.push(new Page())
    app.go.to_page(0)
  }

  this.add = function (path = null) {
    let page = new Page()

    if (path) {
      if (this.paths().indexOf(path) > -1) {
        console.warn(`Already open(skipped): ${path}`);
        return
      }
      page = new Page(this.load(path), path)
    }

    this.pages.push(page)
    app.go.to_page(this.pages.length - 1)

    localStorage.setItem('paths', JSON.stringify(this.paths()))
  }

  this.page = () => this.pages[this.index];

  this.update = () => {
    if (!this.page()) console.warn('Missing page');
    else this.page().commit(app.editor.el.value)
  }

  this.load = function (path) {
    // console.log(`Load: ${path}`)

    let data
    try {
      data = fs.readFileSync(path, 'utf-8')
    } catch (err) {
      console.warn(`Could not load ${path}`)
      return
    }
    return data
  }

  // ========================

  this.new = () => {
    this.add()
    app.reload()

    setTimeout(() => {
      app.sidebar.next_page();
      app.editor.el.focus()
    }, 200)
  }

  this.open = () => {
    // const paths = dialog.showOpenDialogSync(app.win, {properties: ['openFile', 'multiSelections']})
    const paths = [];
    if (!paths) {
      console.error('Nothing to load');
      return
    }

    for (const id in paths) this.add(paths[id])

    setTimeout(() => {
      app.sidebar.next_page();
      app.update()
    }, 200)
  }

  this.save = () => {
    const page = this.page()

    if (!page.path) {
      this.save_as();
      return
    }

    fs.writeFile(page.path, page.text, (err) => {
      if (err) {
        alert('An error occurred updating the file' + err.message);
        console.error(err);
        return
      }
      app.update()
      // setTimeout(() => app.stats.el.innerHTML = `<b>Saved</b> ${page.path}`, 200)
    })
  }

  this.save_as = () => {
    const page = this.page()
    // const path = dialog.showSaveDialogSync(app.win)
    const path = ""
    if (!path) return;

    fs.writeFile(path, page.text, (err) => {
      if (err) {
        alert('An error ocurred creating the file ' + err.message);
        return
      }
      
      if (!page.path) page.path = path
      else if (page.path !== path) this.pages.push(new Page(page.text, path))
      
      app.update()
      // setTimeout(() => app.stats.el.innerHTML = `<b>Saved</b> ${page.path}`, 200)
    })
  }

  this.close = () => {
    // if (this.pages.length === 1) return
    if (this.page().has_changes()) discardPrompt(this._close);
    else this._close();
  }
  this._close = () => {
    this.force_close()
    localStorage.setItem('paths', JSON.stringify(this.paths()))
  }

  this.force_close = () => {
    if (this.pages.length === 1) app.quit();
    else {
      this.pages.splice(this.index, 1)
      app.go.to_page(this.index - 1)
    }
  }

  this.discard = () => discardPrompt(() => app.reload(true));

  this.has_changes = () => {
    for (const id in this.pages)
      if (this.pages[id].has_changes()) return true
    return false
  }

  this.paths = () => {
    const a = []
    for (const id in this.pages) {
      const page = this.pages[id]
      if (page.path) a.push(page.path)
    }
    return a
  }
}