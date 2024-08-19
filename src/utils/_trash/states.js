import {writable} from "svelte/store";

//editor
export let textEdited = writable(false);
export let startingState = writable('');
export let currFilePath = writable('');