<script>
  import {newFile, openFile, saveFile, saveFileAs} from "../../utils/editor";
  import BtnClose from "./buttons/BtnClose.svelte";
  import BtnMaximize from "./buttons/BtnMaximize.svelte";
  import BtnMinimize from "./buttons/BtnMinimize.svelte";
  import MenuBtn from "./MenuBtn.svelte";
  import MenuDiv from "./MenuDiv.svelte";
</script>

<div data-tauri-drag-region class="flex flex-row p-2 space-x-2 border-gray-200 dark:border-gray-700 bg-gray-100/50 dark:bg-gray-800/50 w-[100%] fixed">
  <div class="flex flex-row whitespace-nowrap mr-auto">
    <MenuBtn on:click={openFile}>Open</MenuBtn>
    <MenuDiv/>
    <MenuBtn on:click={newFile}>New</MenuBtn>
    <MenuDiv/>
    <MenuBtn on:click={saveFile}>Save</MenuBtn>
    <MenuBtn on:click={saveFileAs}>Save as</MenuBtn>
  </div>
  <div class="flex flex-row whitespace-nowrap ml-auto space-x-0.5">
    <BtnMinimize/>
    <BtnMaximize/>
    <BtnClose/>
  </div>
</div>