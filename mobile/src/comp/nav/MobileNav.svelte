<script>
  import MobileNavItem from "./MobileNavItem.svelte";
  import MobileNavDropdown from "./MobileNavDropdown.svelte";
  import MobileDrawer from "@mobile/comp/drawer/MobileDrawer.svelte";
  import {showDrawer, showSidebar} from "@mobile/utils/stores.js";
  import {clickOutside} from "@shared/utils/events/clickOutside.js";
  import {onMount} from "svelte";
  import {DragMenu} from "@mobile/utils/drag-menu.js";

  let navEl;
  let drawerOptions = [
    {title: "Home", action:()=>{console.log(1)}},
    {title: "Explore", action:()=>{}},
    {title: "Destinations", action:()=>{}},
    {title: "Hotels", action:()=>{}},
  ]
  
  onMount(() => new DragMenu(navEl));
</script>

<MobileDrawer options={drawerOptions}/>

<div bind:this={navEl} class="nav-drag-area" class:open={$showSidebar}
     use:clickOutside on:click_outside={() => $showSidebar = false}>
  <div class="nav">
    <MobileNavDropdown title="File" icon="file">
      <MobileNavItem title="New" action={() => {}}/>
      <MobileNavItem title="Open..." action={() => {}}/>
      <MobileNavItem title="Open Recent..." action={() => {$showDrawer = true}}/>
      <MobileNavItem title="Save" action={() => {}}/>
      <MobileNavItem title="Save as..." action={() => {}}/>
      <MobileNavItem title="Discard Changes" action={() => {}}/>
      <MobileNavItem title="Close File" action={() => {}}/>
      <MobileNavItem title="Exit App" action={() => {}}/>
    </MobileNavDropdown>
  
    <MobileNavDropdown title="Edit" icon="edit-alt">
      <MobileNavItem title="Undo" action={() => {}}/>
      <MobileNavItem title="Redo" action={() => {}}/>
    </MobileNavDropdown>
  
<!--    <MobileNavDropdown title="Go" icon="navigation">-->
<!--    </MobileNavDropdown>-->
  
<!--    <MobileNavDropdown title="View" icon="window">-->
<!--    </MobileNavDropdown>-->
  </div>
</div>