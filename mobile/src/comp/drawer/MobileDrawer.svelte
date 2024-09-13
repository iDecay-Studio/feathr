<script>
  import MobileDrawerItem from "./MobileDrawerItem.svelte";
  import {drawerItems, showDrawer} from "../../js/stores.js";
  import {clickOutside} from "@feathr/shared/js/events/actions/clickOutside.js";
</script>

<div class="backdrop" class:active={$showDrawer}>
  <div class="drawer" class:open={$showDrawer}
       use:clickOutside on:click_outside={() => $showDrawer = false}>
    {#each $drawerItems as item}
      <MobileDrawerItem {item}/>
    {/each}
  </div>
</div>