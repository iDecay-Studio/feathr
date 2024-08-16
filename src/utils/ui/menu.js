import {writable} from "svelte/store";
import {focusEditor} from "@/utils/editor/file.js";

//states
export let isMenuOpen = writable(false);
export let openMenu = writable("");

const exec = (cmd, focus = true) => {
  if (focus) focusEditor();
  document.execCommand("undo", false, null);
}

export const undo = () => exec("undo");
export const redo = () => exec("redo");

export const find = () => {}
export const replace = () => {}

export const cut = () => exec("cut");
export const copy = () => exec("copy");
export const paste = () => exec("paste");