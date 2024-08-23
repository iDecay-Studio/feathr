<script>
  import {clickOutside} from "@/utils/events/clickOutside.js";
  import {app} from "@/utils/core/app.js";
  import {currCmd, gotoCmd, findCmd, replaceCmd} from "@/utils/core/modules/cmdBar.js";

  let caseSensitive = app.settings.caseSensitive.store;
</script>

<div id="cmdBar" class="fixed left-0 w-full flex items-center gap-1 p-1.5 truncate text-md"
     use:clickOutside on:click_outside={() => app.cmdBar.close()}
>
  <p id="cmdBar-prefix">
    {#if $currCmd === gotoCmd}Go to:{/if}
    {#if $currCmd === findCmd}Find:{/if}
    {#if $currCmd === replaceCmd}Replace:{/if}
  </p>
  <input id="cmdBar-input"
         on:keydown={e => app.cmdBar.on_change(e, true)}
         on:keyup={e => app.cmdBar.on_change(e, false)}
  >
  {#if $currCmd === replaceCmd}
    <p>with:</p>
    <input id="cmdBar-input2">
<!--    <button id="cmdBar-btn-next" on:click={() => app.cmdBar.replace()}>Next</button>-->
<!--    <button id="cmdBar-btn-all" on:click={() => app.cmdBar.active()} style={$currCmd === gotoCmd ? 'display: hidden' : ''}>All</button>-->
  {/if}
  <button id="cmdBar-btn" on:click={() => app.cmdBar.runCmd(false)}>
    <svg xmlns="http://www.w3.org/2000/svg" class="btn p-0.5 header-text" width="26" height="26" fill="currentColor" viewBox="0 0 256 256"><path d="M184,104v32a8,8,0,0,1-8,8H99.31l10.35,10.34a8,8,0,0,1-11.32,11.32l-24-24a8,8,0,0,1,0-11.32l24-24a8,8,0,0,1,11.32,11.32L99.31,128H168V104a8,8,0,0,1,16,0Zm48-48V200a16,16,0,0,1-16,16H40a16,16,0,0,1-16-16V56A16,16,0,0,1,40,40H216A16,16,0,0,1,232,56ZM216,200V56H40V200H216Z"></path></svg>
  </button>
  <div class="w-[1px] h-full bg-gray-200 dark:bg-gray-700 !m-2 !my-1"/>
  <label for="case-sensitive">case-sensitive</label>
  <button name="case-sensitive" on:click={() => app.settings.caseSensitive.toggle()}>
    <svg xmlns="http://www.w3.org/2000/svg" class="btn btn-round header-text" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
      {#if $caseSensitive}
        <path d="M173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34ZM232,128A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z"></path>
      {:else}
        <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Z"></path>
      {/if}
    </svg>
  </button>
</div>