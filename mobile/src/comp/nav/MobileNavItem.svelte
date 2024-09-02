<script>
  import {openMenu} from "@leaf/shared/js/ui/menu.js";
  import {setDrawerItems} from "../../js/stores.js";

  export let item;
  let action = item.action;
  if (item.submenu) action = () => setDrawerItems(item.submenu);
</script>

<button class="nav-link {item.isDropdown && $openMenu === item.title ? 'active' : ''}" on:click={() => {if (item.isDropdown) $openMenu = item.title; action && action()}}>
  {#if item.icon}<i class='nav-icon bx bx-{item.icon}'></i>{/if}
  <span class="nav-name">{item.title}</span>
  {#if item.isDropdown}<i class='bx bx-chevron-down nav-icon nav-dropdown-icon'></i>{/if}
</button>