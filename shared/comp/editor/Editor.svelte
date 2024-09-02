<script>
  import {exec} from "@leaf/shared/js/core/utils.js";
  import {app} from "@leaf/shared/js/core/app.js";
  
  let wordWrap = app.settings.wordWrap.store; 
  let fontType = app.settings.fontType.store; 
  let fontSize = app.settings.fontSize.store;
  
  function onInput(e) {
    app.editor.caret.update(e);
    app.editor.highlighter.update();
    if (app.editor.textEdited()) app.settings.unsavedChanges.set(app.editor.text());
  }
  
  const onKeyEvent = (e) => app.editor.suggestions.onKeyEvent(e);
  
  const onSelect = (e) => {
    app.update();
    // app.editor.suggestions.onSelectText(e);
  }
  const onSelectionChange = (e) => {
    app.editor.caret.update(e);
    // app.editor.suggestions.onSelectText(e);
  }
  
  function onClick(e) {
    app.editor.caret.update(e);
  }
  
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
  <div id="highlights" bind:this={app.editor.highlighter.el}
       class="font-{$fontType}" class:wrap-text={$wordWrap}
       style="font-size: {$fontSize}px;"
  />
  <textarea id="editor" bind:this={app.editor.el}
            class="font-{$fontType}" class:wrap-text={$wordWrap}
            style="font-size: {$fontSize}px; text-overflow: {$wordWrap ? 'wrap' : 'no-wrap'}"
            spellcheck="false" autocorrect="off" autocomplete="off" autocapitalize="off"
            on:input={onInput}
            on:keypress={onKeyEvent}
            on:keydown={onKeyEvent}
            on:keyup={onKeyEvent}
            on:click={onClick}
            on:select={onSelect}
            on:selectionchange={onSelectionChange}
            on:dragleave={onDragLeave}
            on:scroll={onScroll}
  />
</div>