<script>
  import {app} from "@/utils/core/app.js";
  import {textEdited} from "@/utils/_trash/states.js";
</script>

<span id="title" class="flex gap-0 w-fit pointer-events-none select-none truncate text-black dark:text-white/80">
  {app.titleRef?.innerText ?? "Untitled"}
  {#if $textEdited}<span>*</span>{/if}
</span>