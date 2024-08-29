<script>
  import {activeMenuItem} from "../../utils/stores.js";

  export let title = "";
  export let icon = "";
  export let action = null;
  export let isDropdown = false;
</script>

<button class="nav-link {$activeMenuItem === title ? 'active' : ''}" on:click={() => {$activeMenuItem = title; action && action()}}>
  {#if icon !== ""}<i class='nav-icon bx bx-{icon}'></i>{/if}
  <span class="nav-name">{title}</span>
  {#if isDropdown}<i class='bx bx-chevron-down nav-icon nav-dropdown-icon'></i>{/if}
</button>