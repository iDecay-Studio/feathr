<script>
  import {clickOutside} from "@leaf/shared/js/events/clickOutside.js";
  import {app} from "@leaf/shared/js/core/app.js";
  
  let suggestions = app.editor.suggestions.listStore;
  let selItemID = app.editor.suggestions.selItemStore;
  
  function onSelectItem(e) {
    e.preventDefault();
    app.editor.suggestions.selectItem(true);
  }
</script>

<div id="suggestions" bind:this={app.editor.suggestions.el} class:hidden={$suggestions.length === 0}
     use:clickOutside on:click_outside={() => app.editor.suggestions.close()}>
  {#if $suggestions}
    {#each $suggestions as suggestion, id}
      <button class="suggestion-item"
              class:active={selItemID === id}
              on:click={onSelectItem}>
        {suggestion}
      </button>
    {/each}
  {/if}
</div>