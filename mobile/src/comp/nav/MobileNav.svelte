<script>
  import MobileNavDropdown from "./MobileNavDropdown.svelte";
  import MobileDrawer from "../drawer/MobileDrawer.svelte";
  import {clickOutside} from "@feathr/shared/js/events/actions/clickOutside.js";
  import {onMount} from "svelte";
  import {DragMenu} from "../../js/drag-menu.js";
  import {editMenu, fileMenu, goMenu, isMenuOpen, helpMenu, settingsMenu} from "@feathr/shared/js/ui/menu.js";
  import {_} from "svelte-i18n";

  let navEl;
  onMount(() => new DragMenu(navEl));
</script>

<MobileDrawer/>

<div bind:this={navEl} class="nav-drag-area" class:open={$isMenuOpen}
     use:clickOutside on:click_outside={() => $isMenuOpen = false}>
  <div class="nav">
    <div class="nav-content">
      <MobileNavDropdown title="{$_('file.title')}" icon="file" items={$fileMenu}/>
      <MobileNavDropdown title="{$_('edit.title')}" icon="edit-alt" items={$editMenu}/>
      <MobileNavDropdown title="{$_('go.navigate')}" icon="navigation" items={$goMenu}/>
      <MobileNavDropdown title="{$_('settings.title')}" icon="cog" items={$settingsMenu}/>
      <MobileNavDropdown title="{$_('help.title')}" icon="info-circle" items={$helpMenu}/>
    </div>
  </div>
</div>