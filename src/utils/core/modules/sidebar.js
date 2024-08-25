import {app} from "@/utils/core/app.js";
import {clamp} from "@/utils/core/utils.js";

export class Sidebar {
  init = async () => {
    this.el = document.getElementById('sidebar');
    this.el.addEventListener("scroll", this.on_scroll);
  }

  update = async () => {
    let html = '';
    const current = this.marker();

    for (const pid in app.project.pages) {
      const page = app.project.pages[pid];
      if (!page) {
        continue;
      }
      html += `<ul class="${app.project.index === parseInt(pid) ? 'active' : ''}" ondrop='app.project.pages[${[pid]}].on_drop(event)'>`;
      html += await this._page(parseInt(pid), page);
      const markers = page.markers();
      for (const i in markers) {
        const marker = markers[i];
        html += this._marker(pid, current, marker, markers);
      }
      html += '</ul>';
    }
    this.el.innerHTML = html;
  };

  _page = async (id, page) => `<li class='page ${await page.has_changes() ? 'changes' : ''}' onclick='app.go.to_page(${id})'>${await page.name()}</li>`;
  _marker = (pid, current, marker, markers) => `<li class='marker ${marker.type} ${current && current.line === marker.line ? 'active' : ''}' onclick='app.go.to_page(${pid}, ${marker.line})'><span>${marker.text}</span></li>`;

  next_page = () => {
    const page = clamp(parseInt(app.project.index) + 1, 0, app.project.pages.length - 1);
    app.go.to_page(page, 0);
  };

  prev_page = () => {
    const page = clamp(parseInt(app.project.index) - 1, 0, app.project.pages.length - 1);
    app.go.to_page(page, 0);
  };

  next_marker = () => {
    const page = clamp(parseInt(app.project.index), 0, app.project.pages.length - 1);
    const marker = this.marker();
    if (!marker) return;

    const markers = app.project.page().markers();
    const nextIndex = clamp(marker.id + 1, 0, markers.length - 1);

    app.go.to_page(page, markers[nextIndex].line);
  };

  prev_marker = () => {
    const page = clamp(parseInt(app.project.index), 0, app.project.pages.length - 1);
    const marker = this.marker();
    if (!marker) return;

    const markers = app.project.page().markers();
    const nextIndex = clamp(marker.id - 1, 0, markers.length - 1);

    app.go.to_page(page, markers[nextIndex].line);
  };

  marker = () => {
    if (!app.project.page()) return [];

    const markers = app.project.page().markers();
    const pos = app.editor.locate.active_line_id();

    if (markers.length < 1) return;

    for (const id in markers) {
      const marker = markers[id];
      if (marker.line > pos) {
        return markers[parseInt(id) - 1];
      }
    }
    return markers[markers.length - 1];
  };

  on_scroll = () => {
    const scrollDistance = app.editor.el.scrollTop;
    const scrollMax = app.editor.el.scrollHeight - app.editor.el.offsetHeight;
    const scrollPerc = Math.min(1, (scrollMax === 0) ? 0 : (scrollDistance / scrollMax));
    const naviOverflowPerc = Math.max(0, (app.sidebar.el.scrollHeight / window.innerHeight) - 1);

    app.sidebar.el.style.transform = 'translateY(' + (-100 * scrollPerc * naviOverflowPerc) + '%)';
  };
}