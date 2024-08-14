<script>
  import {fileNameDisplay, textEdited} from "../../utils/editor";
</script>

<span bind:this={$fileNameDisplay} class="w-fit px-1.5 py-1 m-[1px] truncate">
  {$fileNameDisplay}
  {#if $textEdited}<span style="font-size: 8px">*</span>{/if}
</span>