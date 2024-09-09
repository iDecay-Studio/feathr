import app from "@/shared/js/core/app.js";
import {inApp} from "@/shared/js/core/utils.js";
import { getCurrentWebview } from "@tauri-apps/api/webview";

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
      e.dataTransfer.dropEffect = 'copy';
      if (e.ctrlKey) e.dataTransfer.dropEffect = 'move';
    }
    document.documentElement.classList.add('dragover');
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
      app.file.path = "C:/Users/User/Desktop/" + file.name;
      app.file.update();
      window.URL.revokeObjectURL(blobURL);
    }
  }

  function finishDragEvent(e) {
    if (!inApp) e.preventDefault();
    document.documentElement.classList.remove('dragover');
  }
}