import app from "@/utils/core/app.js";

/* Drag&drop to open a file */
document.ondragover = (e) => {
  e.stopPropagation()
  e.preventDefault()
  e.dataTransfer.dropEffect = 'copy';
  document.classList.add('dragover');
};

document.ondragleave = document.ondragexit = document.ondragend = (e) => {
  e.preventDefault();
  document.classList.remove('dragover');
};

document.body.ondrop = (e) => {
  e.preventDefault();
  e.stopPropagation();
  
  const files = e.dataTransfer.files

  for (const id in files) {
    const file = files[id]
    if (!file.path) continue
    if (file.type && !file.type.match(/text.*/)) {
      // console.log(`Skipped ${file.type} : ${file.path}`);
      continue
    }
    if (file.path && file.path.substr(-3, 3) === 'thm') continue

    app.project.add(file.path)
  }

  app.reload()
  app.sidebar.next_page()
  document.classList.remove('dragover');
};