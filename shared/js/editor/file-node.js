import {app} from "@leaf/shared/js/core/app.js";
import {getFileNameFromPath} from "@leaf/shared/js/core/utils.js";

export const nodeOpenWithDialog = () => {
  let input = document.createElement('input');
  input.type = 'file';
  input.onchange = _ => {
    // you can use this method to get file and perform respective operations
    let files =   Array.from(input.files);
    console.log(files);
  };
  input.click();
}

export const nodeSave = (path, onSuccess = null) => {
  import('fs/promises').then(fs => {
    return new Promise((success, failure) => {
      fs.writeFile(path, app.editor.text()).then(() => {
        app.editor.startingState = app.editor.text();
        app.settings.unsavedChanges.set("");
        onSuccess && onSuccess();
        success();
      }, (reason) => {
        failure();
        console.error(reason);
      });
    });
  });
}

export const nodeSaveAs = () => {
  const blobData = new Blob([JSON.stringify(app.editor.text())], { type: 'text/plain' });
  const urlToBlob = window.URL.createObjectURL(blobData);

  const a = document.createElement('a');
  a.style.setProperty('display', 'none');
  document.body.appendChild(a);
  a.href = urlToBlob;
  a.download = getFileNameFromPath(this.path);
  a.click();
  window.URL.revokeObjectURL(urlToBlob);
  a.remove();
}