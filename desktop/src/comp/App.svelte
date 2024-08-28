<script>
  import Header from "@desktop/comp/header/Header.svelte";
  import MenuBar from "@desktop/comp/menu/MenuBar.svelte";
  import Sidebar from "@desktop/comp/editor/Sidebar.svelte";
  import Stats from "@desktop/comp/editor/Stats.svelte";
  import Editor from "@shared/comp/editor/Editor.svelte";
  import CmdBar from "@shared/comp/editor/CmdBar.svelte";
  import {app} from "@shared/utils/core/app.js";
  import {onMount} from "svelte";
  import {initShortcuts} from "@desktop/utils/events/shortcuts.js";
  import {initDragDrop} from "@desktop/utils/events/drag-drop.js";
  
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