<script>
  import {exec} from "@/utils/core/utils.js";
  import {app} from "@/utils/core/app.js";
  
  $: wordWrap = app.settings.wordWrap.store; 
  $: fontType = app.settings.fontType.store; 
  
  function onInput(e) {
    app.project.page().commit();
  }

  function onSelect(e) {
    app.update();
  }

  function onDragLeave(e) {
    if (!e.ctrlKey) return
    let start = app.editor.el.selectionStart
    let finish = app.editor.el.selectionEnd
    let old_text = app.editor.el.value
    let moved_text = old_text.substring(start, finish-1)
    exec('delete', moved_text)
    app.editor.el.setSelectionRange(start, start)
    this.project.page().commit()
  }
</script>

<div class="text-black dark:text-white text-sm overflow-auto relative">
    <textarea id="editor" class="p-3 w-full h-full outline-none resize-none bg-transparent -mb-[5px] cursor-auto font-{$fontType}"
              spellcheck="false" autocorrect="off" autocomplete="off" autocapitalize="off"
              wrap={$wordWrap ? "on": "off"}
              on:input={onInput} on:select={onSelect} on:dragleave={onDragLeave}
    />
</div>