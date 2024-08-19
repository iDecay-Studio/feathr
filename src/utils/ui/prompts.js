import {ask as askDialog} from "@tauri-apps/api/dialog";
import app from "@/utils/core/app.js";

export const savePrompt = (action) => {
  if (!app.project.page().has_changes()) action();
  else {
    askDialog("Would you like to save your changes?").then(confirmed => {
      if (confirmed) app.project.save().then(action);
      else action();
    })
  }
}

export const discardPrompt = (action) => {
  if (!app.project.page().has_changes()) action();
  else {
    askDialog("Are you sure you want to discard changes?").then(confirmed => {
      if (confirmed) action();
    });
  }
}