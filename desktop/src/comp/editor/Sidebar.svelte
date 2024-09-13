<script>
  import app from "@feathr/shared/js/core/app.js";
  import {isMobile} from "@feathr/shared/js/core/utils.js";

  let markers = app.sidebar.markers;
  let currMarker = app.sidebar.currMarker;
  let show = app.settings.showSidebar.store;
  let focusMode = app.settings.focusMode.store;
</script>

<div id="sidebar" bind:this={app.sidebar.el} class:hidden={!$show && !$focusMode || isMobile} on:scroll={() => app.sidebar.on_scroll()}>
  {#each $markers as marker}
    <button class="marker marker-{marker.type}"
            class:active={$currMarker && $currMarker.line === marker.line}
            on:click={() => app.go.to_line(marker.line, false)}
    >
      <span class="truncate">{marker.text}</span>
    </button>
  {/each}
</div>