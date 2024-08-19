import {Page} from "@/utils/editor/page.js";
import app from "@/utils/core/app.js";
import {discardPrompt, savePrompt} from "@/utils/ui/prompts.js";
import {isJSON} from "@/utils/core/utils.js";
import {writeFile} from "@tauri-apps/api/fs";
import {message, open as openDialog, save as saveDialog} from "@tauri-apps/api/dialog";
import {open as openWithDefault} from "@tauri-apps/api/shell";
import {fs} from "fs";

export function Project() {
  this.pages = []
  this.index = 0
  
  this.dialogFilters = [
    { name: 'Text Documents', extensions: ['txt', 'md', 'json', 'yml', 'log'] },
    { name: 'All Files', extensions: ['*'] }
  ]

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
    //only create a specific page if not already open
    if (path && this.paths().indexOf(path) === -1) page = new Page(this.load(path), path)

    this.pages.push(page)
    app.go.to_page(this.pages.length - 1)

    localStorage.setItem('paths', JSON.stringify(this.paths()))
  }

  this.page = () => this.pages[this.index];

  this.update = () => {
    if (!this.page()) console.warn('Missing page');
    else this.page().commit(app.editor.el.value)
    app.titleRef.innerText = this.page().name();
  }

  this.load = function (path) {
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

  this.newFile = () => {
    savePrompt(() => {
      this.add()
      app.reload()

      setTimeout(() => {
        app.sidebar.next_page();
        app.editor.el.focus()
      }, 200)
    });
  }

  this.openFile = () => {
    savePrompt(() => openDialog({
      multiple: true,
      filters: this.dialogFilters
    }).then(paths => {
      for (const id in paths) this.add(paths[id])

      setTimeout(() => {
        app.sidebar.next_page();
        app.update()
      }, 200)
    }, reason => message("Error while opening file:" + reason)));
  }

  this.openInExplorer = () => {
    if (this.page().path !== "") openWithDefault(this.page().path);
  }

  this.save = () => {
    const page = this.page();
    if (page.path) {
      return new Promise((success) => {
        writeFile({contents: page.text, path: page.path}).then(() => {
          app.update();
          success();
        }, reason => message('An error occurred saving the file: ' + reason));
      });
    }
    else this.save_as();
  }

  this.save_as = () => {
    const page = this.page()
    return saveDialog({filters: this.dialogFilters}).then((filePath) => {
      writeFile({contents: page.text, path: filePath}).then(
        () => {
          if (!page.path) page.path = filePath
          else if (page.path !== filePath) this.pages.push(new Page(page.text, filePath))
          app.update()
        }, reason => message('An error occurred creating the file:' + reason));
    }, reason => message('An error occurred creating the file:' + reason));
  }

  this.close = () => {
    if (this.page().has_changes()) discardPrompt(this._close);
    else this._close();
  }
  this._close = () => {
    this.force_close()
    localStorage.setItem('paths', JSON.stringify(this.paths()))
  }

  this.force_close = () => {
    if (this.pages.length === 1) this.add();
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