<script>
  import {calculateStats, textEdited, textEditor} from "@/utils/editor";
  import {wordWrap, fontType} from "@/utils/settings.js";
</script>

<div class="size-full text-black dark:text-white text-sm overflow-auto relative">
    <textarea autofocus spellCheck={false} on:input={() => {calculateStats(); textEdited.set(true)}}
              wrap={$wordWrap ? "on": "off"} bind:this={$textEditor}
              class="p-3 w-full h-full outline-none resize-none bg-transparent -mb-[5px] cursor-auto font-{$fontType}"/>
</div>