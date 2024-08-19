import {save as saveDialog, open as openDialog, message} from "@tauri-apps/api/dialog"
import {open as openWithDefault} from '@tauri-apps/api/shell';
import {readTextFile, writeFile} from "@tauri-apps/api/fs";
import {currFilePath, startingState, textEdited} from "@/utils/_trash/states.js";
import {get} from "svelte/store";
import {savePrompt, discardPrompt} from "@/utils/ui/prompts.js";
import {calculateStats} from "@/utils/core/modules/stats.js";
import app from "@/utils/core/app.js";
import {getFileNameFromPath} from "@/utils/core/utils.js";

export const saveFile = () => {
  if (get(currFilePath) !== "") {
    return new Promise((success, failure) => {
      writeFile({contents: app.editor.el.value, path: get(currFilePath)}).then(() => {
          textEdited.set(false);
          startingState.set(app.editor.el.value);
          success();
        }, () => {
          failure();
          message("Error while saving, please try again.")
        }
      );
    })
  } else return saveFileAs();
}

export const saveFileAs = () => {
  return saveDialog({
    filters: [{name: 'Text', extensions: ['txt']}]
  }).then((filePath) => {
    writeFile({contents: app.editor.el.value, path: filePath}).then(
      () => {
        app.titleRef.innerText = getFileNameFromPath(filePath);
        currFilePath.set(filePath);
        textEdited.set(false);
        startingState.set(app.editor.el.value);
      }, () => message("Error while saving, please try again."));
  }, () => message("Error while saving, please try again."));
}

export const closeFile = () => {
  app.editor.el.value = '';
  app.editor.el.setSelectionRange(0, 0);
  startingState.set('');
  currFilePath.set('');
  app.titleRef.innerText = 'Untitled';
  textEdited.set(false);
  calculateStats();
};

export const open = (filePath) => {
  closeFile();
  readTextFile(filePath).then((text) => {
    startingState.set(text);
    currFilePath.set(filePath);
    app.editor.el.value = text;
    app.titleRef.innerText = getFileNameFromPath(filePath);
    calculateStats(); // Update words and characters (It should be 0, however its best to run the function)
  }, () => message("Error while opening file, please try again."));
}

export const discardChanges = () => discardPrompt(() => app.editor.el.value = get(startingState));
export const openInExplorer = () => {
  if (get(currFilePath) !== "") openWithDefault(get(currFilePath));
}

export const newFile = () => savePrompt(closeFile);
export const openFile = (path = "") => savePrompt(() => openDialog({defaultPath: path}).then((filePath) => open(filePath), () => message("Error while opening file, please try again.")));