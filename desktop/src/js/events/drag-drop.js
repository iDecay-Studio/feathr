import app from "@leaf/shared/js/core/app.js";
import {inApp} from "@leaf/shared/js/core/utils.js";

export function initDragDrop() {
  /* Drag&drop to open a file */
  document.addEventListener('dragover', e => {
    e.stopPropagation();
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    if (e.ctrlKey) e.dataTransfer.dropEffect = 'move';
    document.documentElement.classList.add('dragover');
  });

  document.addEventListener('drop', async e => {
    finishDragEvent(e);
    e.stopPropagation();

    const files = e.dataTransfer.files;
    if (files.length === 0) return;

    const file = files[0];
    if (inApp && !file.path || file.type && !file.type.match(/text.*/)) return;
    
    if (inApp) await app.file.open(file.path);
    else {
      let blobURL = URL.createObjectURL(file);
      app.file.open(blobURL);
      app.file.path = "C:/Users/User/Desktop/" + file.name;
      app.file.update();
      window.URL.revokeObjectURL(blobURL);
    }
  });

  document.addEventListener('dragleave', finishDragEvent);
  document.addEventListener('dragend', finishDragEvent);

  function finishDragEvent(e) {
    e.preventDefault();
    document.documentElement.classList.remove('dragover');
  }
}