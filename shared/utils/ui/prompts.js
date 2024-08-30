import {ask as askDialog} from "@tauri-apps/plugin-dialog";
import {app} from "@leaf/shared/utils/core/app.js";

export const savePrompt = (action) => {
  if (!app.editor.textEdited()) action();
  else {
    askDialog("Would you like to save your changes?").then(confirmed => {
      if (confirmed) app.file.save().then(action);
      else action();
    });
  }
};

export const discardPrompt = (action) => {
  if (!app.editor.textEdited()) action();
  else {
    askDialog("Are you sure you want to discard changes?").then(confirmed => {
      if (confirmed) action();
    });
  }
};