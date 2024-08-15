import {appWindow} from "@tauri-apps/api/window";
import {save as saveDialog, open as openDialog, ask as askDialog, message, save} from "@tauri-apps/api/dialog"
import {open as openWithDefault} from '@tauri-apps/api/shell';
import {readTextFile, writeFile} from "@tauri-apps/api/fs";
import {get, writable} from "svelte/store";

//refs
export let textEditor = writable(null);
export let fileNameDisplay = writable(null);
export let statsDisplay = writable(null);

//states
export let textEdited = writable(false);
export let isFullscreen = writable(false);

let startingState = '';
let currentFilePath = '';

export const saveFile = () => {
  if (currentFilePath !== "") {
    return new Promise((success, failure) => {
      writeFile({contents: get(textEditor).value, path: currentFilePath}).then(() => {
          textEdited.set(false);
          startingState = get(textEditor).value;
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
    writeFile({contents: get(textEditor).value, path: filePath}).then(
      () => {
        get(fileNameDisplay).innerText = getFileNameFromPath(filePath);
        currentFilePath = filePath;
        textEdited.set(false);
        startingState = get(textEditor).value;
      }, () => message("Error while saving, please try again."));
  }, () => message("Error while saving, please try again."));
}

export const closeFile = () => {
  get(textEditor).value = '';
  startingState = '';
  currentFilePath = '';
  get(fileNameDisplay).innerText = '';
  textEdited.set(false);
  calculateStats();
};

export const open = (filePath) => {
  closeFile();
  readTextFile(filePath).then((text) => {
    startingState = text;
    get(textEditor).value = text;
    currentFilePath = filePath;
    get(fileNameDisplay).innerText = getFileNameFromPath(filePath);
    calculateStats(); // Update words and characters (It should be 0, however its best to run the function)
  }, () => message("Error while opening file, please try again."));
}

export const discardChanges = () => discardPrompt(() => get(textEditor).value = startingState);
export const openInExplorer = () => {
  if (currentFilePath !== "") openWithDefault(currentFilePath);
}

export const newFile = () => savePrompt(clear);
export const openFile = (path = "") => savePrompt(() => openDialog({defaultPath: path}).then((filePath) => open(filePath), () => message("Error while opening file, please try again.")));
export const closeApp = () => savePrompt(appWindow.close);

export function calculateStats() {
  const lines = get(textEditor).value.split(/\r|\r\n|\n/).length;
  const words = get(textEditor).value.trim().replace("\n", " ").split(/(\s+)/).filter((word) => word.trim().length > 0).length;
  const chars = get(textEditor).value.replace("\n", "").replace(" ", "").length;
  
  const lineSuffix = lines === 1 ? "line" : "lines";
  const wordSuffix = words === 1 ? "word" : "words";
  const charSuffix = chars === 1 ? "char" : "chars";
  
  get(statsDisplay).innerText = `${lines} ${lineSuffix} | ${words} ${wordSuffix} | ${chars} ${charSuffix}`;
  textEdited.set(get(textEditor).value !== startingState);
  console.log(get(textEdited));
}

const getFileNameFromPath = (filePath) => filePath.replace(/^.*(\\|\/|\:)/, "");

const savePrompt = (action) => {
  if (!get(textEdited)) action();
  else {
    askDialog("Would you like to save your changes?").then(confirmed => {
      if (confirmed) saveFile().then(action);
      else action();
    })
  }
}
const discardPrompt = (action) => {
  if (!get(textEdited)) action();
  else {
    askDialog("Would you like to discard your changes?").then(confirmed => {
      if (confirmed) action();
    });
  }
}