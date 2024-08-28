<script>
  import MobileDrawerItem from "./MobileDrawerItem.svelte";
  import {showDrawer} from "@mobile/utils/stores.js";
  
  export let options = [];
  //todo: add on:outside_click handler to close the overlay
</script>

<div class="backdrop" class:active={$showDrawer}>
  <div class="drawer" class:open={$showDrawer}>
    {#each options as option}
      <MobileDrawerItem title={option.title} on:click={() => {$showDrawer = false; option.action && option.action()}}/>
    {/each}
  </div>
</div>