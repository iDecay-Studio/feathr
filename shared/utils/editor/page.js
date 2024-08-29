import {app} from "@leaf/shared/utils/core/app.js";
import {EOL} from "@leaf/shared/utils/core/utils.js";
import {ask as askDialog} from "@tauri-apps/plugin-dialog";
import {stat, readTextFile} from "@tauri-apps/plugin-fs";

export class Page {
  constructor(text = '', path = null) {
    this.text = text.replace(/\r?\n/g, '\n');
    this.path = path;
    this.size = 0;
    this.pos = 0;
  }

  name = async () => {
    let suffix = await this.has_changes() ? "*" : "";
    if (!this.path) return 'Untitled' + suffix;

    console.log(this.path);
    const parts = this.path.replace(/\\/g, '/').split('/');
    return parts[parts.length - 1] + suffix;
  };

  has_changes = async () => {
    if (!this.path) return this.text && this.text.length > 0;

    const last_size = this.size;
    const result = await this.load() !== this.text;

    // was this change done outside the app?
    if (result && (last_size !== this.size)) {
      askDialog("File was modified outside the app. Do you want to reload it?").then(async confirmed => {
        if (confirmed) {
          let data = await app.project.page().load();
          app.project.page().commit(data);
          await app.reload();
          return !result; // return false as it was reloaded
        }
      });
    }

    return result;
  };

  commit = (text = app.editor.el.value) => this.text = text;

  reload = async function (force = false) {
    if (this.path && (!await this.has_changes() || force)) this.commit(await this.load());
  };

  load = async () => {
    if (!this.path) return;

    let data;
    try {
      data = await readTextFile(this.path);
    } catch (err) {
      this.path = null;
      return;
    }

    // update file size
    this.size = (await stat(this.path)).size;

    return data;
  };

  markers = () => {
    const result = [];
    const lines = this.text.split(EOL);

    const add = (id, line, symbol, type) => result.push({
      id: result.length,
      text: line.replace(symbol, '').trim(),
      line: parseInt(id),
      type: type,
    });

    for (const id in lines) {
      const line = lines[id].trim();
      if (line.substring(0, 2) === '##') add(id, line, '##', 'subheader');
      else if (line.substring(0, 1) === '#') add(id, line, '#', 'header');
      else if (line.substring(0, 2) === '--') add(id, line, '--', 'comment');
    }

    return result;
  };

  on_drop = (e) => {
    const text = e.dataTransfer.getData('text');
    this.text += EOL;
    this.text += text;
    if (this === app.project.page()) {
      app.go.to_page(app.project.index);
      app.go.to(app.project.page().pos, app.project.page().pos);
    }
  };
}