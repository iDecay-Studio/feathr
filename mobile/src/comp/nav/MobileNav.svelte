<script>
  import MobileNavDropdown from "./MobileNavDropdown.svelte";
  import MobileDrawer from "../drawer/MobileDrawer.svelte";
  import {clickOutside} from "@feathr/shared/js/events/actions/clickOutside.js";
  import {onMount} from "svelte";
  import {DragMenu} from "../../js/drag-menu.js";
  import {editMenu, fileMenu, goMenu, isMenuOpen, helpMenu, settingsMenu} from "@feathr/shared/js/ui/menu.js";

  let navEl;
  onMount(() => new DragMenu(navEl));
</script>

<MobileDrawer/>

<div bind:this={navEl} class="nav-drag-area" class:open={$isMenuOpen}
     use:clickOutside on:click_outside={() => $isMenuOpen = false}>
  <div class="nav">
    <MobileNavDropdown title="File" icon="file" items={fileMenu}/>
    <MobileNavDropdown title="Edit" icon="edit-alt" items={editMenu}/>
    <MobileNavDropdown title="Navigate" icon="navigation" items={goMenu}/>
    <MobileNavDropdown title="Settings" icon="cog" items={settingsMenu}/>
    <MobileNavDropdown title="Help" icon="info-circle" items={helpMenu}/>
  </div>
</div>