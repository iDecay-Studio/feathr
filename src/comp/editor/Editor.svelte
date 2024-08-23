<script>
  import {exec} from "@/utils/core/utils.js";
  import {app} from "@/utils/core/app.js";
  
  let wordWrap = app.settings.wordWrap.store; 
  let fontType = app.settings.fontType.store; 
  let fontSize = app.settings.fontSize.store; 
  
  function onInput(e) {
    app.editor.caret.update(e);
    app.editor.highlighter.onInput();
    app.project.page().commit();
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

<div id="container">
  <div id="highlights" class="font-{$fontType}" style={`font-size:${$fontSize}px`}/>
  <textarea id="editor" class="font-{$fontType}"
            style={`font-size:${$fontSize}px`}
            spellcheck="false" autocorrect="off" autocomplete="off" autocapitalize="off"
            wrap={$wordWrap ? "on": "off"}
            on:input={onInput}
            on:dragleave={onDragLeave}
            on:select={() => app.update()}
            on:click={e => app.editor.caret.update(e)}
            on:scroll={e => {app.editor.highlighter.onScroll(); app.editor.caret.onScroll(e)}}
            on:selectionchange={e => app.editor.caret.update(e)}
            on:keypress={e => app.editor.suggestions.update(e)}
            on:keydown={e => app.editor.suggestions.update(e)}
            on:keyup={e => app.editor.suggestions.update(e)}
  />
</div>