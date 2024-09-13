<script>
  import BtnClose from "./buttons/BtnClose.svelte";
  import BtnMaximize from "./buttons/BtnMaximize.svelte";
  import BtnMinimize from "./buttons/BtnMinimize.svelte";
  import Title from "./Title.svelte";
</script>

<div data-tauri-drag-region class="header flex flex-row w-full">
  <Title/>
  <div class="flex flex-row whitespace-nowrap p-1 ml-auto">
    <BtnMinimize/>
    <BtnMaximize/>
    <BtnClose/>
  </div>
</div>