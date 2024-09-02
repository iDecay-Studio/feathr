<script>
  import {app} from "@leaf/shared/js/core/app.js";

  let markers = app.sidebar.markers;
  let currMarker = app.sidebar.currMarker;
  let show = app.settings.showSidebar;
  let focusMode = app.settings.focusMode;
</script>

<div id="sidebar" bind:this={app.sidebar.el} class:hidden={!show && !focusMode || app.isMobile} on:scroll={() => app.sidebar.on_scroll()}>
  {#each $markers as marker}
    <button class="marker {marker.type}"
            class:active={$currMarker && $currMarker.line === marker.line}
            on:click={() => app.go.to_line(marker.line)}
    >
      <span>${marker.text}</span>
    </button>
  {/each}
</div>