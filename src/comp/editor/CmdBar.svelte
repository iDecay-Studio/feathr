<script>
  import {clickOutside} from "@/utils/events/clickOutside.js";
  import {app} from "@/utils/core/app.js";
  import {currCmd, gotoCmd, findCmd, replaceCmd} from "@/utils/core/modules/cmdBar.js";

  let searchEl, prevEl, nextEl, counterEl;

  function onInput() {
    app.editor.highlighter.search(searchEl.value, app.settings.caseSensitive.get(), app.settings.matchWords.get());
    updateCmdBar();
  }

  function clear() {
    app.editor.highlighter.clear();
    searchEl.value = '';
    searchEl.focus();
    updateCmdBar();
  }

  function updateCmdBar() {
    if (!counterEl) return;
    counterEl.textContent = app.editor.highlighter.count();
    let counterVal = parseInt(counterEl.textContent);
    prevEl.classList.toggle('hidden', !counterVal);
    nextEl.classList.toggle('hidden', !counterVal);
  }
</script>

<div id="cmdBar" class="fixed left-0 w-full flex items-center gap-1 p-1.5 truncate text-md"
     use:clickOutside on:click_outside={() => app.cmdBar.close()}
>
  <p id="cmdBar-prefix">
    {#if $currCmd === gotoCmd}Go to:{/if}
    {#if $currCmd === findCmd}Find:{/if}
    {#if $currCmd === replaceCmd}Replace:{/if}
  </p>
  <input id="cmdBar-search" bind:this={searchEl}
         on:input={() => onInput()}
         on:keydown={e => app.cmdBar.on_change(e, true)}
         on:keyup={e => app.cmdBar.on_change(e, false)}
  >
  {#if $currCmd === replaceCmd}
    <p>with:</p>
    <input id="cmdBar-replace">
    <button id="cmdBar-btn" on:click={() => app.cmdBar.runCmd(false)}>
      <svg xmlns="http://www.w3.org/2000/svg" class="btn p-0.5 header-text" width="26" height="26" fill="currentColor" viewBox="0 0 256 256"><path d="M184,104v32a8,8,0,0,1-8,8H99.31l10.35,10.34a8,8,0,0,1-11.32,11.32l-24-24a8,8,0,0,1,0-11.32l24-24a8,8,0,0,1,11.32,11.32L99.31,128H168V104a8,8,0,0,1,16,0Zm48-48V200a16,16,0,0,1-16,16H40a16,16,0,0,1-16-16V56A16,16,0,0,1,40,40H216A16,16,0,0,1,232,56ZM216,200V56H40V200H216Z"></path></svg>
    </button>
  {/if}

  {#if $currCmd === findCmd || $currCmd === replaceCmd}
    <button on:click={clear}>Clear</button>
    <button bind:this={prevEl} on:click={() => app.editor.highlighter.prev()}>◀</button>
    <button bind:this={nextEl} on:click={() => app.editor.highlighter.next()}>▶</button>
    <div class="found"><span bind:this={counterEl} id="count"></span> Found</div>
  {/if}
</div>