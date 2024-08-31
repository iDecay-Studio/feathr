<script>
  export let title = "";
  export let wide = false;
  export let isSettings = false;
</script>

<button class="relative w-full group">
  <div class="btn flex cursor-default w-full select-none items-center rounded px-2 py-1.5 outline-none">
    <span>{title}</span>
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 ml-auto"><polyline points="9 18 15 12 9 6"></polyline></svg>
  </div>
  <div data-submenu="" class="submenu absolute top-0 left-0 invisible duration-200 ease-out translate-x-full opacity-0 {isSettings ? 'ml-1 group-hover:ml-0' : 'right-0 mr-1 group-hover:mr-0'} group-hover:visible group-hover:opacity-100">
    <div class="bg z-50 min-w-[9rem] overflow-hidden rounded-md p-1 -mt-[5px] shadow-md animate-in {wide ? 'w-48' : 'w-32'} {isSettings ? 'absolute left-[unset] right-0 slide-in-from-right-1' : 'slide-in-from-left-1'}">
      <slot/>
    </div>
  </div>
</button>