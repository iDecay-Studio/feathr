import {writable} from "svelte/store";

//element refs
export let editorRef = writable(null);
export let fileNameRef = writable(null);
export let statsBarRef = writable(null);

//editor
export let textEdited = writable(false);
export let startingState = writable('');
export let currFilePath = writable('');