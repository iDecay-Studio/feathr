<script>
  import {exec} from "@leaf/shared/utils/core/utils.js";
  import {app} from "@leaf/shared/utils/core/app.js";
  
  let wordWrap = app.settings.wordWrap.store; 
  let fontType = app.settings.fontType.store; 
  let fontSize = app.settings.fontSize.store; 
  
  function onScroll(e) {
    app.editor.highlighter.onScroll();
    app.editor.caret.onScroll(e);
    app.editor.suggestions.onScroll(e);
  }

  function onDragLeave(e) {
    if (!e.ctrlKey) return;
    
    let start = app.editor.el.selectionStart;
    let finish = app.editor.el.selectionEnd;
    let old_text = app.editor.text();
    let moved_text = old_text.substring(start, finish-1);
    exec('delete', moved_text);
    app.editor.el.setSelectionRange(start, start);
  }
</script>

<div id="container">
  <div id="highlights" class="font-{$fontType}" style={`font-size:${$fontSize}px`}/>
  <textarea id="editor" class="font-{$fontType}"
            style={`font-size:${$fontSize}px`}
            spellcheck="false" autocorrect="off" autocomplete="off" autocapitalize="off"
            wrap={$wordWrap ? "on": "off"}
            on:input={e => app.editor.onInput(e)}
            on:scroll={onScroll}
            on:dragleave={onDragLeave}
            on:select={() => app.update()}
            on:click={e => app.editor.caret.update(e)}
            on:selectionchange={e => app.editor.caret.update(e)}
            on:keypress={e => app.editor.suggestions.update(e)}
            on:keydown={e => app.editor.suggestions.update(e)}
            on:keyup={e => app.editor.suggestions.update(e)}
  />
</div>