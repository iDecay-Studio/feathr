<script>
  export let item;
  export let isSettings = false;
</script>

<button class="relative w-full group data-[disabled]:opacity-50 data-[disabled]:pointer-events-none" data-disabled={(item.disabled || !item.submenu.length) ? "" : undefined}>
  <div class="btn flex cursor-default w-full select-none items-center rounded px-2 py-1.5 outline-none">
    <span>{item.title}</span>
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 ml-auto"><polyline points="9 18 15 12 9 6"></polyline></svg>
  </div>
  <div data-submenu="" class="submenu absolute top-0 left-0 invisible duration-200 ease-out translate-x-full opacity-0 {isSettings ? 'ml-1 group-hover:ml-0' : 'right-0 mr-1 group-hover:mr-0'} group-hover:visible group-hover:opacity-100" class:hidden={!item.submenu.length}>
    <div class="bg z-50 min-w-[10rem] max-w-[20rem] overflow-hidden rounded-md p-1 -mt-[5px] shadow-md animate-in w-fit {isSettings ? 'absolute left-[unset] right-0 slide-in-from-right-1' : 'slide-in-from-left-1'}">
      <slot/>
    </div>
  </div>
</button>