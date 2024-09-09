<script>
  import {isMenuOpen, openMenu} from "@feathr/shared/js/ui/menu.js";
  import {setDrawerItems} from "../../js/stores.js";

  export let item;
  const action = () => {
    if (item.isDropdown) $openMenu = item.title;
    if (item.submenu) setDrawerItems(item.submenu);
    else {
      item.action && item.action();
      if (!item.isDropdown) $isMenuOpen = false;
    }
  };
</script>

<button class="nav-link {item.isDropdown && $openMenu === item.title ? 'active' : ''}" on:click={action}>
  {#if item.icon}<i class='nav-icon bx bx-{item.icon}'></i>{/if}
  <span class="nav-name">{item.title + (item.submenu ? '...' : '')}</span>
  {#if item.isDropdown}<i class='bx bx-chevron-down nav-icon nav-dropdown-icon'></i>{/if}
</button>