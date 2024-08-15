<script>
  import {newFile, openFile, saveFile, saveFileAs} from "@/utils/editor";
  import BtnClose from "./buttons/BtnClose.svelte";
  import BtnMaximize from "./buttons/BtnMaximize.svelte";
  import BtnMinimize from "./buttons/BtnMinimize.svelte";
  import MenuBtn from "./MenuBtn.svelte";
  import Title from "@/comp/menu/Title.svelte";
</script>

<div data-tauri-drag-region class="flex flex-row max-h-[40px] border-gray-200 dark:border-gray-700 bg-gray-100/50 dark:bg-gray-800/50 w-full">
  <div class="flex flex-row items-center whitespace-nowrap p-2">
    <Title/>
  </div>
  <div class="flex flex-row whitespace-nowrap p-1 ml-auto">
    <BtnMinimize/>
    <BtnMaximize/>
    <BtnClose/>
  </div>
</div>
<div class="flex flex-row items-center whitespace-nowrap mr-auto max-h-[40px] border-gray-200 dark:border-gray-700 bg-gray-100/50 dark:bg-gray-800/50 w-full">
  <MenuBtn on:click={openFile}>File</MenuBtn>
  <MenuBtn on:click={openFile}>Edit</MenuBtn>
  <MenuBtn on:click={openFile}>Navigate</MenuBtn>
  <MenuBtn on:click={openFile}>View</MenuBtn>
<!--  <MenuBtn on:click={openFile}>Open</MenuBtn>-->
<!--  <MenuBtn on:click={newFile}>New</MenuBtn>-->
<!--  <MenuBtn on:click={saveFile}>Save</MenuBtn>-->
<!--  <MenuBtn on:click={saveFileAs}>Save as</MenuBtn>-->
</div>