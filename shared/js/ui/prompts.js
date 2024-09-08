import {ask as askDialog} from "@tauri-apps/plugin-dialog";
import app from "@leaf/shared/js/core/app.js";
import {inApp} from "@leaf/shared/js/core/utils.js";

const saveMsg = "Would you like to save your changes?";
export const savePrompt = (action) => {
  if (!app.editor.textEdited()) action();
  else {
    if (inApp) {
      askDialog(saveMsg).then(confirmed => {
        if (confirmed) app.file.save().then(action);
        else action();
      });
    }
    else {
      if (confirm(saveMsg)) app.file.save().then(action);
      else action();
    }
  }
};

const discardMsg = "Are you sure you want to discard your changes?";
export const discardPrompt = (action) => {
  if (!app.editor.textEdited()) action();
  else {
    if (inApp) {
      askDialog(discardMsg).then(confirmed => {
        if (confirmed) action();
      });
    }
    else if (confirm(discardMsg)) action();
  }
};