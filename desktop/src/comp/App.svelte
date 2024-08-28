<script>
  import Editor from "./comp/editor/Editor.svelte";
  import Header from "./comp/header/Header.svelte";
  import MenuBar from "./comp/menu/MenuBar.svelte";
  import CmdBar from "./comp/editor/CmdBar.svelte";
  import Sidebar from "./comp/editor/Sidebar.svelte";
  import Stats from "./comp/editor/Stats.svelte";
  import {app} from "../utils/core/app.js";
  import {onMount} from "svelte";
  
  onMount(async () => app.init());
</script>

<Header/>
<MenuBar/>
<Sidebar/>
<Editor/>
<Stats/>
<CmdBar/>