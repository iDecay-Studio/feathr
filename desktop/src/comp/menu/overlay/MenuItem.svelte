<script>
  import {isMenuOpen} from "@/shared/js/ui/menu.js";

  export let item;
  
  let setting = item.setting ? item.setting() : null;
  let store = setting ? setting.store : null;
  let compareTo = item.compareTo ?? true;
  
  let action = item.action;
  if (setting) action = typeof compareTo === "boolean" ? () => setting.toggle() : () => setting.set(compareTo);
</script>

<button class="btn relative flex justify-between w-full cursor-default select-none group items-center rounded px-2 py-1.5 transition-all duration-100 outline-none data-[disabled]:opacity-50 data-[disabled]:pointer-events-none {item.color ? 'text-' + item.color : ''}"
        on:click={() => {action && action(); item.closeMenu !== false && isMenuOpen.set(false)}}
        data-disabled={item.disabled ? "" : undefined}
>
  <span>{item.title}</span>
  {#if item.shortcut && item.shortcut !== ""}
    <span class="shortcut ml-auto text-xs tracking-widest transition-all duration-100">{item.shortcut}</span>
  {/if}
  {#if $store === compareTo}
    <span class="ml-auto mt-0.5 flex h-full w-3.5 items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><polyline points="20 6 9 17 4 12"></polyline></svg>
    </span>
  {/if}
  {#if item.isLink}
    <span class="ml-auto mt-0.5 flex h-full w-3.5 items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="rgb(29, 155, 240)" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M12 6h-6a2 2 0 0 0 -2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-6" />
        <path d="M11 13l9 -9" />
        <path d="M15 4h5v5" />
      </svg>
    </span>
  {/if}
</button>