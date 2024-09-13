<script>
  import {clickOutside} from "@feathr/shared/js/events/actions/clickOutside.js";
  import app from "@feathr/shared/js/core/app.js";
  
  let isOpen = app.editor.suggestions.isOpen;
  let suggestions = app.editor.suggestions.listStore;
  let selItemID = app.editor.suggestions.selItemStore;
  let fontSize = app.settings.fontSize.store;
  
  const onSelectItem = (e, id) => app.editor.suggestions.selectItem(e, id);
</script>

<div id="suggestions" bind:this={app.editor.suggestions.el} class:hidden={!$isOpen}
     style="font-size: {$fontSize-0.3}rem; line-height: {$fontSize-0.25}rem; margin-top: {$fontSize+0.15}rem; max-height: {5 * ($fontSize+0.45)}rem"
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