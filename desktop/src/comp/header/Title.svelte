<script>
  import app from "@feathr/shared/js/core/app.js";
  import {onMount} from "svelte";
  
  let currPath = app.file.pathStore;
  let isSmallWindow;
  
  onMount(() => {
    new ResizeObserver(() => update()).observe(document.documentElement);
  });
  
  const update = () => isSmallWindow = window.innerWidth < 600;
</script>

<div class="tooltip-wrapper relative grid items-center px-3 gap-0 w-fit">
  <span id="title" title={isSmallWindow ? $currPath : ""} class="select-none truncate whitespace-nowrap"/>
  {#if !isSmallWindow && $currPath !== ""}
    <span class="tooltip">{$currPath}</span>
  {/if}
</div>