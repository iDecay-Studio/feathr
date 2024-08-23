<script>
  import {isMenuOpen, openMenu} from "@/utils/ui/menu.js";
  import {flyIn} from "@/utils/ui/transitions.js";
  import {get} from "svelte/store";

  export let title;
</script>

<div class="relative h-full cursor-default">
  <button on:click={() => {isMenuOpen.set(!get(isMenuOpen)); openMenu.set(title)}}
          on:mouseover={() => openMenu.set(title)} on:focus={() => openMenu.set(title)}
          class="btn font-600 h-full" data-active={$isMenuOpen && $openMenu === title ? "" : undefined}>
    {title}
  </button>
  {#if $isMenuOpen && $openMenu === title}
    <div in:flyIn class="bg flex flex-col absolute top-0 z-50 min-w-[9rem] rounded-md mt-7 text-sm p-1 shadow-md w-48 -translate-x-0.5">
      <slot/>
    </div>
  {/if}
</div>