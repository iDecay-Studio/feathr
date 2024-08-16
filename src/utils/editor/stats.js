import {get} from "svelte/store";
import {startingState, statsBarRef, textEdited, editorRef} from "@/utils/core/states.js";

export function calculateStats() {
  const lines = get(editorRef).value.split(/\r|\r\n|\n/).length;
  const words = get(editorRef).value.trim().replace("\n", " ").split(/(\s+)/).filter((word) => word.trim().length > 0).length;
  const chars = get(editorRef).value.replace("\n", "").replace(" ", "").length;

  const lineSuffix = lines === 1 ? "line" : "lines";
  const wordSuffix = words === 1 ? "word" : "words";
  const charSuffix = chars === 1 ? "char" : "chars";

  get(statsBarRef).innerText = `${lines} ${lineSuffix} | ${words} ${wordSuffix} | ${chars} ${charSuffix}`;
  textEdited.set(get(editorRef).value !== get(startingState));
}