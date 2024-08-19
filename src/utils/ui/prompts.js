import {get} from "svelte/store";
import {ask as askDialog} from "@tauri-apps/api/dialog";
import {saveFile} from "@/utils/editor/file.js";
import {textEdited} from "@/utils/_trash/states.js";

export const savePrompt = (action) => {
  if (!get(textEdited)) action();
  else {
    askDialog("Would you like to save your changes?").then(confirmed => {
      if (confirmed) saveFile().then(action);
      else action();
    })
  }
}

export const discardPrompt = (action) => {
  if (!get(textEdited)) action();
  else {
    askDialog("Are you sure you want to discard changes?").then(confirmed => {
      if (confirmed) action();
    });
  }
}