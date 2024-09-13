<script>
  import app from "@feathr/shared/js/core/app.js";
  
  let currPath = app.file.pathStore;
</script>

<div class="tooltip-wrapper relative grid items-center px-3 gap-0 w-fit">
  <span id="title" class="select-none truncate whitespace-nowrap"/>
  {#if $currPath !== ""}
    <span class="tooltip">{$currPath}</span>
  {/if}
</div>