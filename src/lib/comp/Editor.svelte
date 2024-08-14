<script>
  import {calculateStats, textEdited, textEditor, textWrapEnabled} from "../utils/editor";
  import Menu from "./menu/Menu.svelte";
</script>


<div class="flex flex-col flex-grow h-full border border-gray-200 dark:border-gray-700">
  <Menu/>
  <div class="mt-[112px] w-[100%] h-[100%] text-black dark:text-white text-sm overflow-auto relative">
    <textarea spellCheck={false} onInput={() => {calculateStats(); textEdited.set(true)}}
              wrap={$textWrapEnabled ? "on": "off"} bind:this={$textEditor}
              class="p-3 w-full h-full outline-none resize-none bg-transparent -mb-[5px] cursor-auto"/>
  </div>
</div>