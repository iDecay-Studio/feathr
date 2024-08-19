import app from "@/utils/core/app.js";
import {EOL} from "@tauri-apps/api/os";
import {ask as askDialog} from "@tauri-apps/api/dialog";
import {fs} from "fs";

export function Page(text = '', path = null) {
  this.text = text.replace(/\r?\n/g, '\n');
  this.path = path;
  this.size = 0;
  this.pos = 0;

  this.name = () => {
    let suffix = this.has_changes() ? "*" : "";
    if (!this.path) return 'Untitled' + suffix;

    const parts = this.path.replace(/\\/g, '/').split('/');
    return parts[parts.length - 1] + suffix;
  };

  this.has_changes = () => {
    if (!this.path) return this.text && this.text.length > 0;

    const last_size = this.size;
    const result = this.load() !== this.text;

    // was this change done outside the app?
    if (result && (last_size !== this.size)) {
      askDialog("File was modified outside the app. Do you want to reload it?").then(confirmed => {
        if (confirmed) {
          app.project.page().commit(app.project.page().load());
          app.reload();
          return !result; // return false as it was reloaded
        }
      });
    }

    return result;
  };

  this.commit = (text = app.editor.el.value) => this.text = text;

  this.reload = function (force = false) {
    if (this.path && (!this.has_changes() || force)) this.commit(this.load());
  };

  this.load = () => {
    if (!this.path) return;

    let data;
    try {
      data = fs.readFileSync(this.path, 'utf-8');
    } catch (err) {
      this.path = null;
      return;
    }

    // update file size
    this.size = fs.statSync(this.path).size;

    return data;
  };

  this.markers = () => {
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

  this.on_drop = function (e) {
    const text = e.dataTransfer.getData('text');
    this.text += EOL;
    this.text += text;
    if (this === app.project.page()) {
      app.go.to_page(app.project.index);
      app.go.to(app.project.page().pos, app.project.page().pos);
    }
  };
}