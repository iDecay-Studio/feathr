<script>
  import {textEdited} from "@/utils/_trash/states.js";
  import {calculateStats} from "@/utils/core/modules/stats.js";
  import {wordWrap, fontType} from "@/utils/core/modules/settings.js";
  import app from "@/utils/core/app.js";
  
  function onInput(e) {
    app.project.page().commit();
    calculateStats();
    textEdited.set(true);
  }

  function onSelect(e) {
    app.update();
  }
</script>

<div class="size-full text-black dark:text-white text-sm overflow-auto relative">
    <textarea id="editor" class="p-3 w-full h-full outline-none resize-none bg-transparent -mb-[5px] cursor-auto font-{$fontType}"
              spellcheck="false" autocorrect="off" autocomplete="off" autocapitalize="off"
              wrap={$wordWrap ? "on": "off"}
              on:input={onInput} on:select={onSelect}
    />
</div>