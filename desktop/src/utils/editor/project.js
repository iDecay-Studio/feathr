import {Page} from "@desktop/utils/editor/page.js";
import {app} from "@desktop/utils/core/app.js";
import {discardPrompt, savePrompt} from "@desktop/utils/ui/prompts.js";
import {isJSON} from "@desktop/utils/core/utils.js";
import {readTextFile, writeFile} from "@tauri-apps/plugin-fs";
import {message, open as openDialog, save as saveDialog} from "@tauri-apps/plugin-dialog";
import {open as openWithDefault} from "@tauri-apps/plugin-shell";

export class Project {
  init = async () => {
    this.pages = [];
    this.index = 0;

    this.dialogFilters = [
      // {name: 'Text Documents', extensions: ['txt', 'md', 'json', 'yml', 'log']},
      {name: 'All Files', extensions: ['*']},
    ];

    // Load previous files
    if (localStorage.hasOwnProperty('paths')) {
      if (isJSON(localStorage.getItem('paths'))) {
        const paths = JSON.parse(localStorage.getItem('paths'));
        for (const id in paths) await this.add(paths[id]);
      }
    }

    if (this.pages.length === 0) {
      this.pages.push(new Page());
      app.go.to_page(0);
    }
  }

  add = async (path = null) => {
    let page = new Page();
    //only create a specific page if not already open
    if (path && this.paths().indexOf(path) === -1) page = new Page(await this.load(path), path);

    this.pages.push(page);
    app.go.to_page(this.pages.length - 1);

    localStorage.setItem('paths', JSON.stringify(this.paths()));
  };

  page = () => this.pages[this.index];

  update = async () => {
    if (!this.page()) console.warn('Missing page');
    else this.page().commit(app.editor.el.value);
    app.titleRef.innerText = await this.page().name();
  };

  load = async function (path) {
    try {
      return await readTextFile(path);
    } catch (err) {
      console.warn(`Could not load ${path}`);
    }
  };

  // ========================

  newFile = () => {
    savePrompt(async () => {
      await this.add();
      await app.reload();

      setTimeout(() => {
        app.sidebar.next_page();
        app.editor.el.focus();
      }, 200);
    });
  };

  openFile = () => {
    savePrompt(() => openDialog({
      multiple: true,
      filters: this.dialogFilters,
    }).then(async paths => {
      for (const id in paths) await this.add(paths[id]);

      setTimeout(() => {
        app.sidebar.next_page();
        app.update();
      }, 200);
    }, reason => message("Error while opening file:" + reason)));
  };

  openInExplorer = async () => {
    if (this.page().path !== "") await openWithDefault(this.page().path);
  };

  save = async () => {
    const page = this.page();
    if (page.path) {
      return new Promise((success) => {
        writeFile(page.path, page.text).then(async () => {
          await app.update();
          success();
        }, reason => message('An error occurred saving the file: ' + reason));
      });
    } else await this.save_as();
  };

  save_as = () => {
    const page = this.page();
    return saveDialog({filters: this.dialogFilters}).then((filePath) => {
      writeFile(filePath, page.text).then(async () => {
          if (!page.path) page.path = filePath;
          else if (page.path !== filePath) this.pages.push(new Page(page.text, filePath));
          await app.update();
        }, reason => message('An error occurred creating the file:' + reason));
    }, reason => message('An error occurred creating the file:' + reason));
  };

  close = async () => {
    if (await this.page().has_changes()) discardPrompt(this._close);
    else await this._close();
  };
  _close = async () => {
    await this.force_close();
    localStorage.setItem('paths', JSON.stringify(this.paths()));
  };

  force_close = async () => {
    if (this.pages.length === 1) await this.add();
    else {
      this.pages.splice(this.index, 1);
      app.go.to_page(this.index - 1);
    }
  };

  discard = () => discardPrompt(async () => await app.reload(true));

  has_changes = () => {
    for (const id in this.pages)
      if (this.pages[id].has_changes()) return true;
    return false;
  };

  paths = () => {
    const a = [];
    for (const id in this.pages) {
      const page = this.pages[id];
      if (page.path) a.push(page.path);
    }
    return a;
  };
}