import {ask as askDialog} from "@tauri-apps/plugin-dialog";
import app from "@leaf/shared/js/core/app.js";
import {inApp} from "@leaf/shared/js/core/utils.js";

export const savePrompt = (action) => {
  if (!app.editor.textEdited()) action();
  else {
    if (inApp) {
      askDialog("Would you like to save your changes?").then(confirmed => {
        if (confirmed) app.file.save().then(action);
        else action();
      });
    }
    else {
      if (confirm("Would you like to save your changes?")) app.file.save().then(action);
      else action();
    }
  }
};

export const discardPrompt = (action) => {
  if (!app.editor.textEdited()) action();
  else {
    if (inApp) {
      askDialog("Are you sure you want to discard changes?").then(confirmed => {
        if (confirmed) action();
      });
    }
    else if (confirm("Are you sure you want to discard changes?")) action();
  }
};