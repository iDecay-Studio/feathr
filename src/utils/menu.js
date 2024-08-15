import {writable} from "svelte/store";

//states
export let isMenuOpen = writable(false);
export let openMenu = writable("");

export const undo = () => {}
export const redo = () => {}

export const find = () => {}
export const replace = () => {}

export const cut = () => {}
export const copy = () => {}
export const paste = () => {}