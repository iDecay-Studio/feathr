<script>
  import {textEdited, editorRef} from "@/utils/core/states.js";
  import {calculateStats} from "@/utils/editor/stats.js";
  import {wordWrap, fontType} from "@/utils/core/settings.js";
</script>

<div class="size-full text-black dark:text-white text-sm overflow-auto relative">
    <textarea autofocus spellCheck={false} on:input={() => {calculateStats(); textEdited.set(true)}}
              wrap={$wordWrap ? "on": "off"} bind:this={$editorRef}
              class="p-3 w-full h-full outline-none resize-none bg-transparent -mb-[5px] cursor-auto font-{$fontType}"/>
</div>