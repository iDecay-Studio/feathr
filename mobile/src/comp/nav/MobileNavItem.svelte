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

<button class="nav-link data-[disabled]:opacity-50 data-[disabled]:pointer-events-none {item.isDropdown && $openMenu === item.title ? 'active' : ''}" on:click={action} data-disabled={item.submenu && !item.submenu.length ? "" : undefined}>
  {#if item.icon}<i class='nav-icon bx bx-{item.icon}'></i>{/if}
  <span class="nav-name truncate">{item.title + (item.submenu ? '...' : '')}</span>
  {#if item.isDropdown}<i class='bx bx-chevron-down nav-icon nav-dropdown-icon'></i>{/if}
</button>