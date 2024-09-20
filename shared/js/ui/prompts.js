import {ask as askDialog} from "@tauri-apps/plugin-dialog";
import app from "@feathr/shared/js/core/app.js";
import {inApp} from "@feathr/shared/js/core/utils.js";
import {format, unwrapFunctionStore} from 'svelte-i18n'

const _ = unwrapFunctionStore(format);

export const savePrompt = (action) => {
  if (!app.editor.textEdited) action();
  else {
    if (inApp) {
      askDialog(_('prompts.save_changes')).then(confirmed => {
        if (confirmed) app.file.save().then(action);
        else action();
      });
    }
    else {
      if (confirm(_('prompts.save_changes'))) app.file.save().then(action);
      else action();
    }
  }
};

export const discardPrompt = (action) => {
  if (!app.editor.textEdited) action();
  else {
    if (inApp) {
      askDialog(_('prompts.discard_changes')).then(confirmed => {
        if (confirmed) action();
      });
    }
    else if (confirm(_('prompts.discard_changes'))) action();
  }
};