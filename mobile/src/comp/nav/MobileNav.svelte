<script>
  import MobileNavDropdown from "./MobileNavDropdown.svelte";
  import MobileDrawer from "../drawer/MobileDrawer.svelte";
  import {clickOutside} from "@leaf/shared/utils/events/clickOutside.js";
  import {onMount} from "svelte";
  import {DragMenu} from "../../utils/drag-menu.js";
  import {editMenu, fileMenu, goMenu, isMenuOpen, settingsMenu} from "@leaf/shared/utils/ui/menu.js";

  let navEl;
  onMount(() => new DragMenu(navEl));
</script>

<MobileDrawer/>

<div bind:this={navEl} class="nav-drag-area" class:open={$isMenuOpen}
     use:clickOutside on:click_outside={() => $isMenuOpen = false}>
  <div class="nav">
    <MobileNavDropdown title="File" icon="file" items={fileMenu}/>
    <MobileNavDropdown title="Edit" icon="edit-alt" items={editMenu}/>
    <MobileNavDropdown title="Go" icon="navigation" items={goMenu}/>
    <MobileNavDropdown title="Settings" icon="cog" items={settingsMenu}/>
<!--    <MobileNavDropdown title="About" icon="info-circle" items={aboutMenu}/>-->
  </div>
</div>