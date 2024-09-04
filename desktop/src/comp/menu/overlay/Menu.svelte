<script>
  import {isMenuOpen, openMenu} from "@leaf/shared/js/ui/menu.js";
  import {flyIn} from "../../../js/ui/transitions.js";
  import {get} from "svelte/store";
  import MenuDiv from "./MenuDiv.svelte";
  import SubMenu from "./SubMenu.svelte";
  import MenuItem from "./MenuItem.svelte";

  export let title;
  export let items;
  let isSettings = title === "Settings";
</script>

<div class="menu relative h-full cursor-default {isSettings ? 'ml-auto pr-0.5' : ''}">
  <button on:click={() => {isMenuOpen.set(!get(isMenuOpen)); openMenu.set(title)}}
          on:mouseover={() => openMenu.set(title)} on:focus={() => openMenu.set(title)}
          class="btn font-600 h-full" class:btn-round={isSettings} data-active={$isMenuOpen && $openMenu === title ? "" : undefined}>
    {#if isSettings}
      <svg xmlns="http://www.w3.org/2000/svg" class="icon-settings" width="22" height="22" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z" />
        <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
      </svg>
    {:else}
      {title}
    {/if}
  </button>
  {#if $isMenuOpen && $openMenu === title}
    <div in:flyIn class="menu-overlay bg flex flex-col absolute top-0 z-50 rounded-md mt-7 text-sm p-1 shadow-md -translate-x-0.5 {isSettings ? 'right-0 w-32' : 'w-48 min-w-[9rem]'}">
      {#each items as item}
        {#if item.divider}
          <MenuDiv/>
        {:else if item.submenu}
          <SubMenu {item} {isSettings}>
            {#if item.submenu.length}
              {#each item.submenu as subitem}
                <MenuItem item={subitem}/>
              {/each}
            {/if}
          </SubMenu>
        {:else}
          <MenuItem {item}/>
        {/if}
      {/each}
    </div>
  {/if}
</div>