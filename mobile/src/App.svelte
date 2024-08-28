<script>
  import MobileHeader from "@mobile/comp/header/MobileHeader.svelte";
  import MobileNav from "@mobile/comp/nav/MobileNav.svelte";
  import Editor from "@shared/comp/editor/Editor.svelte";
  import CmdBar from "@shared/comp/editor/CmdBar.svelte";
  import {app} from "@shared/utils/core/app.js";
  import {onMount} from "svelte";

  onMount(async () => {
    await app.init();
  });
</script>

<MobileHeader/>
<MobileNav/>
<Editor/>
<CmdBar/>

<!--<main>-->
<!--  <section>-->
<!--    <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Incidunt vel illum fuga unde cum, voluptates magni molestias eveniet culpa autem ut, totam veniam, suscipit tempore ullam pariatur est at asperiores?</p>-->
<!--    <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Incidunt vel illum fuga unde cum, voluptates magni molestias eveniet culpa autem ut, totam veniam, suscipit tempore ullam pariatur est at asperiores?</p>-->
<!--    <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Incidunt vel illum fuga unde cum, voluptates magni molestias eveniet culpa autem ut, totam veniam, suscipit tempore ullam pariatur est at asperiores?</p>-->
<!--  </section>-->
<!--</main>-->