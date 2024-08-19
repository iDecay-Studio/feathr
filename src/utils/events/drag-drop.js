import app from "@/utils/core/app.js";

/* Drag&drop to open a file */
document.ondragover = (e) => {
  e.stopPropagation()
  e.preventDefault()
  e.dataTransfer.dropEffect = 'copy';
  if (e.ctrlKey) e.dataTransfer.dropEffect = 'move'
  document.classList.add('dragover');
};

document.ondragleave = document.ondragexit = document.ondragend = (e) => {
  e.preventDefault();
  document.classList.remove('dragover');
};

document.body.ondrop = (e) => {
  e.preventDefault();
  e.stopPropagation();
  document.classList.remove('dragover');
  
  const files = e.dataTransfer.files
  if (files.length === 0) return

  for (const id in files) {
    const file = files[id]
    if (!file.path) continue
    if (file.type && !file.type.match(/text.*/)) continue

    app.project.add(file.path)
  }

  app.reload()
  app.sidebar.next_page()
};