<script>
  import MobileHeader from "./comp/header/MobileHeader.svelte";
  import MobileNav from "./comp/nav/MobileNav.svelte";
  import Editor from "@feathr/shared/comp/editor/Editor.svelte";
  import Stats from "@feathr/shared/comp/editor/Stats.svelte";
  import CmdBar from "@feathr/shared/comp/editor/CmdBar.svelte";
  import Suggestions from "@feathr/shared/comp/editor/Suggestions.svelte";
  import app from "@feathr/shared/js/core/app.js";
  import {onMount} from "svelte";

  onMount(async () => await app.init());
</script>

<MobileHeader/>
<MobileNav/>
<Editor/>
<Stats/>
<CmdBar/>
<Suggestions/>