<script>
  import {app} from "@leaf/shared/utils/core/app.js";

  let markers = app.sidebar.markers;
  let currMarker = app.sidebar.currMarker;
</script>

<div id="sidebar" on:scroll={() => app.sidebar.on_scroll()}>
  {#each $markers as marker}
    <button class="marker {marker.type}"
            class:active={$currMarker && $currMarker.line === marker.line}
            on:click={() => app.go.to_line(marker.line)}
    >
      <span>${marker.text}</span>
    </button>
  {/each}
</div>