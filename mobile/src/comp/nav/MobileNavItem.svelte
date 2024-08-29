<script>
  import {openMenu} from "@leaf/shared/utils/ui/menu.js";
  import {drawerItems, showDrawer} from "../../utils/stores.js";

  export let item;
  let action = item.action;
  if (item.submenu) action = () => {drawerItems.set(item.submenu); showDrawer.set(true)};
</script>

<button class="nav-link {$openMenu === item.title ? 'active' : ''}" on:click={() => {$openMenu = item.title; action && action()}}>
  {#if item.icon}<i class='nav-icon bx bx-{item.icon}'></i>{/if}
  <span class="nav-name">{item.title}</span>
  {#if item.isDropdown}<i class='bx bx-chevron-down nav-icon nav-dropdown-icon'></i>{/if}
</button>