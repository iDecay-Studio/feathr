<script>
  import {showDrawer} from "../../utils/stores.js";

  export let item;

  let setting = item.setting;
  let store = setting ? setting.store : null;
  let compareTo = item.compareTo ?? true;

  let action = item.action;
  if (setting) action = typeof compareTo === "boolean" ? () => setting.toggle() : () => setting.set(compareTo);
</script>

<button class="drawer-item" on:click={() => {action && action(); item.closeMenu !== false && showDrawer.set(false)}}>
  {item.title}
  {#if $store === compareTo}<i class='nav-icon bx bx-check'></i>{/if}
</button>