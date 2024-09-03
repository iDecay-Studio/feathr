import app from "@leaf/shared/js/core/app.js";
import {clamp} from "@leaf/shared/js/core/utils.js";
import {get, writable} from "svelte/store";

export class Sidebar {
  el = null;
  markers = writable([]);
  currMarker = writable(null);

  update = async () => {
    this.markers.set(app.editor.getMarkers());
    this.currMarker.set(this.#getCurrMarker());
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
    const pos = app.editor.locate.active_line_id();
    if (markers.length < 1) return;

    for (const id in markers) {
      const marker = markers[id];
      if (marker.line > pos) return markers[parseInt(id) - 1];
    }
    return markers[markers.length - 1];
  };
}