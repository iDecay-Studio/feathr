import {open} from "@/utils/editor.js";

/* Drag&drop to open a file */
document.ondragover = (e) => {
  e.preventDefault();
  document.classList.add('dragover');
};

document.ondragleave = document.ondragexit = document.ondragend = (e) => {
  e.preventDefault();
  document.classList.remove('dragover');
};

document.body.ondrop = (e) => {
  e.preventDefault();
  open(e.dataTransfer.files[0].path);
  document.classList.remove('dragover');
};