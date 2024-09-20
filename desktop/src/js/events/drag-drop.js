import app from "@feathr/shared/js/core/app.js";
import {demoPath, inApp} from "@feathr/shared/js/core/utils.js";
import {getCurrentWebview} from "@tauri-apps/api/webview";

let unlisten;

/* init listeners to open a file via drag & drop */
export function initDragDrop() {
  if (inApp) {
    // if (unlisten) unlisten();
    
    unlisten = getCurrentWebview().onDragDropEvent(evt => {
      let evtType = evt.payload.type;
      
      if (evtType === "over") onDragOver(evt);
      else if (evtType === "drop") onDrop(evt, evt.payload.paths);
      else if (evtType === "leave") finishDragEvent(evt);
    });
  }
  else {
    document.addEventListener('dragover', onDragOver);
    document.addEventListener('drop', e => onDrop(e, e.dataTransfer.files));
    document.addEventListener('dragleave', finishDragEvent);
    document.addEventListener('dragend', finishDragEvent);
  }
  
  function onDragOver(e) {
    if (!inApp) {
      e.stopPropagation();
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      if (e.ctrlKey) e.dataTransfer.dropEffect = 'copy';
      
      //only show dragover effect when not dragging text inside the editor around
      let types = e.dataTransfer.types;
      if (types.length && types[0] !== "text/plain") document.documentElement.classList.add('dragover');
    }
    else document.documentElement.classList.add('dragover');
  }

  function onDrop(e, files) {
    finishDragEvent(e);
    if (!inApp) e.stopPropagation();

    if (files.length === 0) return;
    const file = files[0];
    
    if (inApp) app.file.open(file);
    else {
      if (file.type && !file.type.match(/text.*/)) return;
      
      let blobURL = URL.createObjectURL(file);
      app.file.open(blobURL);
      app.file.setPath(demoPath + file.name);
      window.URL.revokeObjectURL(blobURL);
    }
  }

  function finishDragEvent(e) {
    // if (!inApp) e.preventDefault();
    document.documentElement.classList.remove('dragover');
  }
}