<script>
  export let title = "";
</script>

<button class="relative w-full group">
  <div class="btn header-text flex cursor-default w-full select-none items-center rounded px-2 py-1.5 outline-none">
    <span>{title}</span>
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 ml-auto"><polyline points="9 18 15 12 9 6"></polyline></svg>
  </div>
  <div data-submenu="" class="absolute top-0 right-0 invisible mr-1 duration-200 ease-out translate-x-full opacity-0 group-hover:mr-0 group-hover:visible group-hover:opacity-100">
    <div class="bg z-50 min-w-[9rem] overflow-hidden rounded-md border p-1 -mt-[5px] shadow-md animate-in slide-in-from-left-1 w-32">
      <slot/>
    </div>
  </div>
</button>