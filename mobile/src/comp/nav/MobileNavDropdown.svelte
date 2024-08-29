<script>
  import MobileNavItem from "./MobileNavItem.svelte";
  import {activeDropdown, setActiveDropdown} from "../../utils/stores.js";

  export let title = "";
  export let icon = "";
</script>

<div class="nav-dropdown" class:open={$activeDropdown === title}>
  <MobileNavItem {title} {icon} isDropdown={true} action={() => setActiveDropdown(title)}/>

  <div class="nav-dropdown-collapse">
    <div class="nav-dropdown-content">
      <slot/>
    </div>
  </div>
</div>