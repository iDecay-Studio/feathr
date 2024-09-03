<script>
  import {clickOutside} from "@leaf/shared/js/events/clickOutside.js";
  import app from "@leaf/shared/js/core/app.js";
  
  let suggestions = app.editor.suggestions.listStore;
  let selItemID = app.editor.suggestions.selItemStore;
  let fontSize = app.settings.fontSize.store;
  
  function onSelectItem(e, id) {
    e.preventDefault();
    app.editor.suggestions.selectItem(true, id);
  }
</script>

<div id="suggestions" bind:this={app.editor.suggestions.el} class:hidden={$suggestions.length === 0}
     style="font-size: {$fontSize-2}px; line-height: {$fontSize-2}px; margin-top: {$fontSize+2}px;"
     use:clickOutside on:click_outside={() => app.editor.suggestions.close()}>
  {#if $suggestions}
    {#each $suggestions as suggestion, id}
      <button class="suggestion-item"
              class:active={$selItemID === id}
              on:click={e => onSelectItem(e, id)}>
        {suggestion}
      </button>
    {/each}
  {/if}
</div>