<script>
  import MobileDrawerItem from "./MobileDrawerItem.svelte";
  import {drawerItems, showDrawer} from "../../utils/stores.js";
  import {clickOutside} from "@leaf/shared/utils/events/clickOutside.js";
</script>

<div class="backdrop" class:active={$showDrawer}>
  <div class="drawer" class:open={$showDrawer}
       use:clickOutside on:click_outside={() => $showDrawer = false}>
    {#each $drawerItems as item}
      <MobileDrawerItem {item}/>
    {/each}
  </div>
</div>