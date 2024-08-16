import {appWindow} from "@tauri-apps/api/window";
import {save as saveDialog, open as openDialog, message} from "@tauri-apps/api/dialog"
import {open as openWithDefault} from '@tauri-apps/api/shell';
import {readTextFile, writeFile} from "@tauri-apps/api/fs";
import {currFilePath, fileNameRef, startingState, textEdited, editorRef} from "@/utils/core/states.js";
import {get} from "svelte/store";
import {savePrompt, discardPrompt} from "@/utils/ui/prompts.js";
import {calculateStats} from "@/utils/editor/stats.js";

export const focusEditor = () => get(editorRef).focus();

export const saveFile = () => {
  if (get(currFilePath) !== "") {
    return new Promise((success, failure) => {
      writeFile({contents: get(editorRef).value, path: get(currFilePath)}).then(() => {
          textEdited.set(false);
          startingState.set(get(editorRef).value);
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
    writeFile({contents: get(editorRef).value, path: filePath}).then(
      () => {
        get(fileNameRef).innerText = getFileNameFromPath(filePath);
        currFilePath.set(filePath);
        textEdited.set(false);
        startingState.set(get(editorRef).value);
      }, () => message("Error while saving, please try again."));
  }, () => message("Error while saving, please try again."));
}

export const closeFile = () => {
  get(editorRef).value = '';
  startingState.set('');
  currFilePath.set('');
  get(fileNameRef).innerText = '';
  textEdited.set(false);
  calculateStats();
};

export const open = (filePath) => {
  closeFile();
  readTextFile(filePath).then((text) => {
    startingState.set(text);
    currFilePath.set(filePath);
    get(editorRef).value = text;
    get(fileNameRef).innerText = getFileNameFromPath(filePath);
    calculateStats(); // Update words and characters (It should be 0, however its best to run the function)
  }, () => message("Error while opening file, please try again."));
}

export const discardChanges = () => discardPrompt(() => get(editorRef).value = get(startingState));
export const openInExplorer = () => {
  if (get(currFilePath) !== "") openWithDefault(get(currFilePath));
}

export const newFile = () => savePrompt(closeFile);
export const openFile = (path = "") => savePrompt(() => openDialog({defaultPath: path}).then((filePath) => open(filePath), () => message("Error while opening file, please try again.")));
export const closeApp = () => savePrompt(appWindow.close);

const getFileNameFromPath = (filePath) => filePath.replace(/^.*(\\|\/|\:)/, "");