import {writable} from "svelte/store";
import {app} from "@desktop/utils/core/app.js";
import {exec} from "@desktop/utils/core/utils.js";
import {findCmd, gotoCmd, replaceCmd} from "@desktop/utils/core/modules/cmdBar.js";

//states
export let isMenuOpen = writable(false);
export let openMenu = writable("");

export const undo = () => exec("undo");
export const redo = () => exec("redo");

export const find = () => app.cmdBar.open(findCmd);
export const replace = () => app.cmdBar.open(replaceCmd);

export const cut = () => exec("cut");
export const copy = () => exec("copy");
export const paste = () => exec("paste");

export const selectAutocomplete = () => app.editor.select.autocomplete();
export const selectSynonym = () => app.editor.select.synonym();

export const gotoLine = () => app.cmdBar.open(gotoCmd);
export const gotoPrevMarker = () => app.sidebar.prev_marker();
export const gotoNextMarker = () => app.sidebar.next_marker();
export const gotoPrevFile = () => app.sidebar.prev_page();
export const gotoNextFile = () => app.sidebar.next_page();