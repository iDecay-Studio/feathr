<script>
  import {fileNameDisplay, textEdited} from "@/utils/editor.js";
</script>

<span bind:this={$fileNameDisplay} class="flex gap-0 w-fit pointer-events-none select-none truncate text-black dark:text-white/80">
  {$fileNameDisplay?.innerText ?? "Untitled"}
  {#if $textEdited}<span>*</span>{/if}
</span>