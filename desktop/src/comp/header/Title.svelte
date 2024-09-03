<script>
import app from "@leaf/shared/js/core/app.js";
</script>

<button id="title" tabindex=-1
        class="flex gap-0 w-fit select-none truncate cursor-default"
        on:click={() => console.log('Path: ' + (app.file.path ?? 'none'))}/>