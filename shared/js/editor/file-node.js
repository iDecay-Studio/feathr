//these functions serve as as a fallback to the tauri-based methods
// to test the file-handling inside the web-version of the app.
import app from "@leaf/shared/js/core/app.js";

export const nodeOpenWithDialog = (onOpenSuccess, onOpenFail) => {
  let input = document.createElement('input');
  input.type = 'file';
  input.onchange = _ => {
    let blobURL = URL.createObjectURL(input.files[0]);
    onOpenSuccess(blobURL);
    app.file.path = "C:/Users/User/Desktop/" + input.files[0].name;
    app.file.update();
    window.URL.revokeObjectURL(blobURL);
  };
  input.click();
}

export const nodeOpen = (path, onOpenSuccess, onOpenFail) => {
  fetch(path)
  .then((res) => res.text())
  .then((text) => {
    onOpenSuccess(text);
  })
  .catch(onOpenFail);
}

export const nodeSave = (path, onSaveSuccess, onSaveFail) => {
  import('fs/promises').then(fs => {
    return new Promise((success, failure) => {
      fs.writeFile(path, app.editor.text()).then(
        () => onSaveSuccess(success),
        reason => onSaveFail(reason, failure));
    });
  });
}

export const nodeSaveAs = () => {
  const blobData = new Blob([app.editor.text()], { type: 'text/plain' });
  const blobURL = window.URL.createObjectURL(blobData);

  const a = document.createElement('a');
  a.style.setProperty('display', 'none');
  document.body.appendChild(a);
  a.href = blobURL;
  a.download = app.file.getTitle(false) + ".txt";
  a.click();
  window.URL.revokeObjectURL(blobURL);
  a.remove();
}