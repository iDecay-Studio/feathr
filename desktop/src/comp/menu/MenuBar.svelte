<script>
  //based on: https://devdojo.com/pines/docs/menubar
  import {clickOutside} from "@feathr/shared/js/events/actions/clickOutside.js";
  import {isMenuOpen, fileMenu, editMenu, goMenu, helpMenu, settingsMenu} from "@feathr/shared/js/ui/menu.js";
  import Menu from "./overlay/Menu.svelte";
  import {_} from "svelte-i18n";
</script>

<div class="menubar flex flex-row items-center whitespace-nowrap mr-auto w-full">
  <div class="flex size-full px-1 select-none"
       use:clickOutside on:click_outside={() => $isMenuOpen = false}>
    <Menu title="{$_('file.title')}" items={$fileMenu}/>
    <Menu title="{$_('edit.title')}" items={$editMenu}/>
    <Menu title="{$_('go.title')}" items={$goMenu}/>
    <Menu title="{$_('help.title')}" items={$helpMenu}/>
    <Menu title="Settings" items={$settingsMenu}/>
  </div>
</div>