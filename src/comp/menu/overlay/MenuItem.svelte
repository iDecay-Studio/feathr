<script>
  import {isMenuOpen} from "@/utils/ui/menu.js";

  export let title;
  export let shortcut = "";
  export let action = null;
  export let active = false;
  export let disabled = false;
  export let closeOnClick = true;
</script>

<button on:click={() => {action && action(); closeOnClick && isMenuOpen.set(false)}} class="btn header-text relative flex justify-between w-full cursor-default select-none group items-center rounded px-2 py-1.5 transition-all duration-100 outline-none data-[disabled]:opacity-50 data-[disabled]:pointer-events-none" data-disabled={disabled ? "" : undefined}>
  <span>{title}</span>
  {#if shortcut !== ""}
    <span class="shortcut ml-auto text-xs tracking-widest transition-all duration-100">{shortcut}</span>
  {/if}
  {#if active}
    <span class="ml-auto mt-0.5 flex h-full w-3.5 items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><polyline points="20 6 9 17 4 12"></polyline></svg></span>
  {/if}
</button>