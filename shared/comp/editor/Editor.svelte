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
  
  const onFocus = _ => app.editor.caret.show();
  const onBlur = _ => app.editor.caret.hide();
  
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
    if (app.editor.selection.get().slice(-1) !== " ") return;
    
    let selStart = app.editor.selection.start();
    let selEnd = app.editor.selection.end();
    
    app.editor.selection.set(selStart, selEnd - 1);
  }, 0); //add a delay of 0ms to wait until the selection is in the final position
</script>

<div id="container" style="font-size: {$fontSize}rem; line-height: {$fontSize+0.25}rem; text-overflow: {$wordWrap ? 'wrap' : 'no-wrap'}">
  <div id="highlights" class="font-{$fontType}" class:wrap-text={$wordWrap}/>
  <textarea id="editor"
            class="font-{$fontType}" class:wrap-text={$wordWrap}
            spellcheck="false" autocorrect="off" autocomplete="off" autocapitalize="off"
            on:input={e => onInput(e)}
            on:keydown={e => onKeyDown(e)}
            on:keypress={e => onKeyPress(e)}
            on:keyup={e => onKeyUp(e)}
            on:focus={e => onFocus(e)}
            on:blur={e => onBlur(e)}
            on:dblclick={e => onDblClick(e)}
            on:select={e => onSelect(e)}
            on:selectionchange={e => onSelectionChange(e)}
            on:dragleave={e => onDragLeave(e)}
            on:scroll={e => onScroll(e)}
  />
  <div id="caret"/>
</div>