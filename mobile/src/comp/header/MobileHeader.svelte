<script>
  import {isMenuOpen} from "@feathr/shared/js/ui/menu.js";
  import {newDocument} from "@feathr/shared/js/core/utils.js";
  import app from "@feathr/shared/js/core/app.js";
  import {tick} from "svelte";

  export let fileName = newDocument();
  let searchInputEl;
  let showSearch = false;
  
  function onInput(evt) {
    // log(evt.target.value);
    app.editor.highlighter.search(evt.target.value);
  }
  
  function onToggle() {
    showSearch = !showSearch;
    app.editor.highlighter.clear();
    if (showSearch) tick().then(() => searchInputEl.focus());
    else searchInputEl.value = "";
  }
</script>

<header class="header">
  <div class="header-container">
    <div class="header-search" class:open={showSearch}>
      <div id="title" class="header-title" class:hidden={showSearch}>{fileName}</div>
      <input type="search"
             placeholder="Search"
             class="header-input"
             class:hidden={!showSearch}
             bind:this={searchInputEl}
             on:input={onInput}>
      <button class='bx bx-search header-icon' on:click={() => onToggle()}></button>
    </div>

    <button class="header-toggle" on:click={() => $isMenuOpen = !$isMenuOpen} class:pointer-events-none={$isMenuOpen}>
      <i id="header-toggle" class='bx bx-menu' class:bx-x={$isMenuOpen}></i>
    </button>
  </div>
</header>