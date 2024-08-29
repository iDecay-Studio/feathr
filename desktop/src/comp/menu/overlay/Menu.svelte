<script>
  import {isMenuOpen, openMenu} from "@leaf/shared/utils/ui/menu.js";
  import {flyIn} from "../../../utils/ui/transitions.js";
  import {get} from "svelte/store";
  import MenuDiv from "./MenuDiv.svelte";
  import SubMenu from "./SubMenu.svelte";
  import MenuItem from "./MenuItem.svelte";

  export let title;
  export let items;
</script>

<div class="relative h-full cursor-default">
  <button on:click={() => {isMenuOpen.set(!get(isMenuOpen)); openMenu.set(title)}}
          on:mouseover={() => openMenu.set(title)} on:focus={() => openMenu.set(title)}
          class="btn font-600 h-full" data-active={$isMenuOpen && $openMenu === title ? "" : undefined}>
    {title}
  </button>
  {#if $isMenuOpen && $openMenu === title}
    <div in:flyIn class="bg flex flex-col absolute top-0 z-50 min-w-[9rem] rounded-md mt-7 text-sm p-1 shadow-md w-48 -translate-x-0.5">
      {#each items as item}
        {#if item.divider}
          <MenuDiv/>
        {:else if item.submenu}
          <SubMenu title={item.title}>
            {#each item.submenu as subitem}
              <MenuItem item={subitem}/>
            {/each}
          </SubMenu>
        {:else}
          <MenuItem {item}/>
        {/if}
      {/each}
    </div>
  {/if}
</div>