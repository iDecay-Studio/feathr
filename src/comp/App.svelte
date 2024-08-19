<script>
  import Editor from "@/comp/editor/Editor.svelte";
  import Header from "@/comp/header/Header.svelte";
  import MenuBar from "@/comp/menu/MenuBar.svelte";
  import Operator from "@/comp/editor/Operator.svelte";
  import Sidebar from "@/comp/editor/Sidebar.svelte";
  import Stats from "@/comp/editor/Stats.svelte";
  import {onMount} from "svelte";
  import {app} from "@/utils/core/app.js";
  
  onMount(async () => app.init());
</script>

<div class="flex flex-col flex-grow h-full border border-gray-200 dark:border-gray-700">
  <Header/>
  <MenuBar/>
  <Sidebar/>
  <Editor/>
  <Stats/>
  <Operator/>
</div>