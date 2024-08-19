import {writable} from "svelte/store";
import app from "@/utils/core/app.js";
import {exec} from "@/utils/core/utils.js";

//states
export let isMenuOpen = writable(false);
export let openMenu = writable("");

export const undo = () => exec("undo");
export const redo = () => exec("redo");

export const find = () => app.operator.open('find: ');
export const replace = () => app.operator.open('replace: a -> b');

export const cut = () => exec("cut");
export const copy = () => exec("copy");
export const paste = () => exec("paste");

export const selectAutocomplete = () => app.editor.select.autocomplete();
export const selectSynonym = () => app.editor.select.synonym();

export const gotoLine = () => app.operator.open('goto: ');
export const gotoPrevMarker = () => app.sidebar.prev_marker();
export const gotoNextMarker = () => app.sidebar.next_marker();
export const gotoPrevFile = () => app.sidebar.prev_page();
export const gotoNextFile = () => app.sidebar.next_page();