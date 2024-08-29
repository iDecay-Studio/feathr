<script>
  import {isMenuOpen} from "@leaf/shared/utils/ui/menu.js";

  export let fileName = "Untitled";
  let showSearch = false;
</script>

<header class="header">
  <div class="header-container">
    <div class="header-search" class:open={showSearch}>
      {#if showSearch}
        <input type="search" placeholder="Search" class="header-input">
      {:else}
        <div id="title" class="header-title">{fileName}</div>
      {/if}
      <button class='bx bx-search header-icon' on:click={() => showSearch = !showSearch}></button>
    </div>

    <button class="header-toggle" on:click={() => $isMenuOpen = !$isMenuOpen} class:pointer-events-none={$isMenuOpen}>
      <i id="header-toggle" class='bx bx-menu' class:bx-x={$isMenuOpen}></i>
    </button>
  </div>
</header>