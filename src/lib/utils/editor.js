import {appWindow} from "@tauri-apps/api/window";
import {save as saveDialog, open as openDialog, ask as askDialog, message} from "@tauri-apps/api/dialog"
import {readTextFile, writeFile} from "@tauri-apps/api/fs";
import {get, writable} from "svelte/store";

//refs
export let textEditor = writable(null);
export let fileNameDisplay = writable(null);
export let statsDisplay = writable(null);

//states
export let textEdited = writable(false);
export let textWrapEnabled = writable(true);

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
  return saveDialog().then((filePath) => {
    writeFile({contents: get(textEditor).value, path: filePath}).then(
      () => {
        get(fileNameDisplay).innerText = getFileNameFromPath(filePath);
        currentFilePath = filePath;
        textEdited.set(false);
        startingState = get(textEditor).value;
      }, () => message("Error while saving, please try again."));
  }, () => message("Error while saving, please try again."));
}

const clear = () => {
  get(textEditor).value = '';
  startingState = '';
  currentFilePath = '';
  get(fileNameDisplay).innerText = '';
  textEdited.set(false);
  calculateStats();
};

export const newFile = () => {
  if (!get(textEdited)) clear();
  else discardPrompt(clear, "To create a new file please save or discard your work.");
};

const open = () => {
  clear();
  return openDialog().then((filePath) => {
    readTextFile(filePath).then((text) => {
      startingState = text;
      get(textEditor).value = text;
      currentFilePath = filePath;
      get(fileNameDisplay).innerText = getFileNameFromPath(filePath);
      calculateStats(); // Update words and characters (It should be 0, however its best to run the function)
    }, () => message("Error while opening file, please try again."));
  }, () => message("Error while opening file, please try again."));
}

export const openFile = () => {
  if (!get(textEdited)) open();
  else discardPrompt(open, "To open a new file, please save or discard your work.");
};

export const closeApplication = () => {
  if (!get(textEdited)) appWindow.close();
  else discardPrompt(() => appWindow.close(), "To close, please save or discard your work.");
};

export function calculateStats() {
  const words = get(textEditor).value.trim().replace("\n", " ").split(/(\s+)/).filter((word) => word.trim().length > 0).length;
  const characters = get(textEditor).value.replace("\n", "").replace(" ", "").length;
  get(statsDisplay).innerText = `${words} Words, ${characters} Characters`;
  textEdited.set(get(textEditor).value !== startingState());
}

const getFileNameFromPath = (filePath) => filePath.replace(/^.*(\\|\/|\:)/, "");

const discardPrompt = (action, canceledMsg) => {
  askDialog("Would you like to discard your work?").then(confirmed => {
    if (confirmed) action();
    else message(canceledMsg);
  })
}