<script>
  //based on: https://devdojo.com/pines/docs/menubar
  import {clickOutside} from "@leaf/shared/utils/events/clickOutside.js";
  import {isMenuOpen, fileMenu, editMenu, goMenu, viewMenu} from "@leaf/shared/utils/ui/menu.js";
  import Menu from "./overlay/Menu.svelte";
</script>

<div class="flex flex-row items-center whitespace-nowrap mr-auto w-full">
  <div class="flex size-full px-1 select-none"
       use:clickOutside on:click_outside={() => $isMenuOpen = false}>
    <Menu title="File" items={fileMenu}/>
    <Menu title="Edit" items={editMenu}/>
    <Menu title="Go" items={goMenu}/>
    <Menu title="View" items={viewMenu}/>
  </div>
</div>