<script>
  import Header from "./header/Header.svelte";
  import MenuBar from "./menu/MenuBar.svelte";
  import Sidebar from "./editor/Sidebar.svelte";
  import Stats from "./editor/Stats.svelte";
  import Editor from "@leaf/shared/comp/editor/Editor.svelte";
  import CmdBar from "@leaf/shared/comp/editor/CmdBar.svelte";
  import {app} from "@leaf/shared/utils/core/app.js";
  import {onMount} from "svelte";
  import {initShortcuts} from "../utils/events/shortcuts.js";
  import {initDragDrop} from "../utils/events/drag-drop.js";
  
  onMount(async () => {
    await app.init();
    initShortcuts();
    initDragDrop();
  });
</script>

<Header/>
<MenuBar/>
<Sidebar/>
<Editor/>
<Stats/>
<CmdBar/>