<script>
  import app from "@feathr/shared/js/core/app.js";
  import {exec} from "@feathr/shared/js/core/utils.js";

  let wordWrap = app.settings.wordWrap.store; 
  let fontType = app.settings.fontType.store; 
  let fontSize = app.settings.fontSize.store;

  const onInput = (e) => {
    app.editor.textEdited = true;
    app.editor.caret.update(e);
    app.editor.highlighter.update();
    app.settings.unsavedChanges.set(app.editor.text());
  }
  
  const onKeyDown = (e) => app.editor.suggestions.onKeyEvent(e);
  const onKeyPress = (e) => app.editor.suggestions.onKeyEvent(e);
  const onKeyUp = (e) => app.editor.suggestions.onKeyEvent(e);
  
  const onSelect = (e) => {
    app.update();
    app.editor.suggestions.onSelectText(e);
  }
  const onSelectionChange = (e) => app.editor.caret.update(e);
  
  const onClick = (e) => app.editor.caret.update(e);
  const onFocus = (e) => app.editor.caret.update(e);
  
  const onScroll = (e) => {
    app.editor.highlighter.onScroll();
    app.editor.caret.onScroll(e);
    app.editor.suggestions.onScroll(e);
  }

  const onDragLeave = (e) => {
    if (!e.ctrlKey) return;
    
    let start = app.editor.selection.start();
    let finish = app.editor.selection.end();
    let old_text = app.editor.text();
    let moved_text = old_text.substring(start, finish-1);
    exec('delete', moved_text);
    app.editor.selection.set(start);
  }
  
  const onDblClick = _ => setTimeout(() => {
    //remove trailing whitespace when double-clicking a word
    while (app.editor.text().substring(app.editor.selection.end() -1, app.editor.selection.end()) === " ")
      app.editor.get().selectionStart -= 1;
  }, 0); //add a delay of 0ms to wait until the selection is in the final position
</script>

<div id="container"
     style="font-size: {$fontSize}rem; line-height: {$fontSize+0.25}rem; text-overflow: {$wordWrap ? 'wrap' : 'no-wrap'}">
  <div id="highlights" bind:this={app.editor.highlighter.el}
       class="font-{$fontType}" class:wrap-text={$wordWrap}
  />
  <textarea id="editor" bind:this={app.editor.el}
            class="font-{$fontType}" class:wrap-text={$wordWrap}
            spellcheck="false" autocorrect="off" autocomplete="off" autocapitalize="off"
            on:input={onInput}
            on:keydown={onKeyDown}
            on:keypress={onKeyPress}
            on:keyup={onKeyUp}
            on:focus={onFocus}
            on:click={onClick}
            on:dblclick={onDblClick}
            on:select={onSelect}
            on:selectionchange={onSelectionChange}
            on:dragleave={onDragLeave}
            on:scroll={onScroll}
  />
</div>