<script>
  import {fileNameRef, textEdited} from "@/utils/core/states.js";
</script>

<span bind:this={$fileNameRef} class="flex gap-0 w-fit pointer-events-none select-none truncate text-black dark:text-white/80">
  {$fileNameRef?.innerText ?? "Untitled"}
  {#if $textEdited}<span>*</span>{/if}
</span>