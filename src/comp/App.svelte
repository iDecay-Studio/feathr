<script>
  import Header from "./header/Header.svelte";
  import StatsBar from "@/comp/StatsBar.svelte";
  import NavBar from "@/comp/menu/MenuBar.svelte";
  import Editor from "@/comp/Editor.svelte";
</script>

<div class="flex flex-col flex-grow h-full border border-gray-200 dark:border-gray-700">
  <Header/>
  <NavBar/>
  <Editor/>
  <StatsBar/>
</div>