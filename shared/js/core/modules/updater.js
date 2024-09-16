import {check} from "@tauri-apps/plugin-updater";
import {ask, message} from "@tauri-apps/plugin-dialog";
import {invoke} from "@tauri-apps/api/core";
import {inApp} from "@feathr/shared/js/core/utils.js";
import {format, unwrapFunctionStore} from 'svelte-i18n'

const _ = unwrapFunctionStore(format);

export async function checkForUpdates(onUserClick = false) {
  if (!inApp) {
    console.warn("Updater disabled outside app.");
    return;
  }

  try {
    const update = await check();
    log("update: ", update);

    if (update === null) await errMsg(onUserClick, _('updater.try_again_later'));
    else if (update?.available) {
      let msg = _('updater.update_available_desc', {values:{version: update.version, notes: update.body}});
      const yes = await ask(msg, {
        title: _('updater.update_available'),
        kind: 'info',
        okLabel: _('updater.update'),
        cancelLabel: _('updater.cancel')
      });
      if (yes) {
        await update.downloadAndInstall();
        // Restart the app after the update is installed by calling the Tauri command that handles restart for your app
        // It is good practice to shut down any background processes gracefully before restarting
        // As an alternative, you could ask the user to restart the app manually
        await invoke("graceful_restart");
        //alt.: await relaunch();
      }
    } else if (onUserClick) {
      await message(_('updater.no_update_available_desc'), {
        title: _('updater.no_update_available'),
        kind: 'info',
        okLabel: _('updater.ok')
      });
    }
  } catch (err) {
    await errMsg(onUserClick, err);
  }
}

async function errMsg(onUserClick, suffix) {
  if (onUserClick) {
    await message(_('updater.failed_to_check') + ' ' + suffix, {
      title: _('updater.error'),
      kind: 'error',
      okLabel: _('updater.ok')
    });
  }
}