import app from "@feathr/shared/js/core/app.js";
import {clamp, EOL} from "@feathr/shared/js/core/utils.js";
import {get, writable} from "svelte/store";

export class Sidebar {
  el = null;
  markers = writable([]);
  currMarker = writable(null);

  update = async () => {
    this.markers.set(this.getMarkers());
    this.currMarker.set(this.#getCurrMarker());
  };

  getMarkers = () => {
    const result = [];
    const lines = app.editor.text().split(EOL);

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

  on_scroll = () => {
    const scrollDistance = app.editor.el.scrollTop;
    const scrollMax = app.editor.el.scrollHeight - app.editor.el.offsetHeight;
    const scrollPerc = Math.min(1, (scrollMax === 0) ? 0 : (scrollDistance / scrollMax));
    const naviOverflowPerc = Math.max(0, (app.sidebar.el.scrollHeight / window.innerHeight) - 1);

    app.sidebar.el.style.transform = 'translateY(' + (-100 * scrollPerc * naviOverflowPerc) + '%)';
  };

  next_marker = () => this.#jump_to_marker(1);
  prev_marker = () => this.#jump_to_marker(-1);
  #jump_to_marker = (add) => {
    const currMarker = get(this.currMarker);
    if (!currMarker) return;

    const markers = get(this.markers);
    const nextIndex = clamp(currMarker.id + add, 0, markers.length - 1);

    app.go.to_line(markers[nextIndex].line);
  };

  #getCurrMarker = () => {
    const markers = get(this.markers);
    if (markers.length < 1) return;
    
    const pos = app.editor.locate.active_line_id();

    for (const id in markers) {
      const marker = markers[id];
      if (marker.line > pos) return markers[parseInt(id) - 1];
    }
    return markers[markers.length - 1];
  };
}