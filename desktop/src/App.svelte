<script>
  import Header from "./comp/header/Header.svelte";
  import MenuBar from "./comp/menu/MenuBar.svelte";
  import Sidebar from "./comp/editor/Sidebar.svelte";
  import Stats from "@feathr/shared/comp/editor/Stats.svelte";
  import Editor from "@feathr/shared/comp/editor/Editor.svelte";
  import CmdBar from "@feathr/shared/comp/editor/CmdBar.svelte";
  import Suggestions from "@feathr/shared/comp/editor/Suggestions.svelte";
  import app from "@feathr/shared/js/core/app.js";
  import {onMount} from "svelte";
  import {initShortcuts} from "./js/events/shortcuts.js";
  import {initDragDrop} from "./js/events/drag-drop.js";
  
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
<Suggestions/>