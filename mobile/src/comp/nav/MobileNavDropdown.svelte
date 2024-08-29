<script>
  import MobileNavItem from "./MobileNavItem.svelte";
  import {activeDropdown, setActiveDropdown} from "../../utils/stores.js";
  import MobileNavDiv from "./MobileNavDiv.svelte";

  export let title = "";
  export let icon = "";
  export let items;
</script>

<div class="nav-dropdown" class:open={$activeDropdown === title}>
  <MobileNavItem item={{title:title, icon:icon, action:() => setActiveDropdown(title), isDropdown:true}}/>

  <div class="nav-dropdown-collapse">
    <div class="nav-dropdown-content">
      {#each items as item}
        {#if item.divider}
          <MobileNavDiv/>
        {:else}
          <MobileNavItem {item}/>
        {/if}
      {/each}
    </div>
  </div>
</div>