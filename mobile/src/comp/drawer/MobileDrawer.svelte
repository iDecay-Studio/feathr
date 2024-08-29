<script>
  import MobileDrawerItem from "./MobileDrawerItem.svelte";
  import {showDrawer} from "../../utils/stores.js";
  import {clickOutside} from "@leaf/shared/utils/events/clickOutside.js";

  export let options = [];
</script>

<div class="backdrop" class:active={$showDrawer}>
  <div class="drawer" class:open={$showDrawer}
       use:clickOutside on:click_outside={() => $showDrawer = false}>
    {#each options as option}
      <MobileDrawerItem title={option.title} on:click={() => {$showDrawer = false; option.action && option.action()}}/>
    {/each}
  </div>
</div>