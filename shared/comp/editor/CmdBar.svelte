<script>
  import {clickOutside} from "@feathr/shared/js/events/actions/clickOutside.js";
  import app from "@feathr/shared/js/core/app.js";
  import {currCmd, gotoCmd, findCmd, replaceCmd} from "@feathr/shared/js/core/modules/cmdBar.js";
  import {derived} from "svelte/store";
  import {_} from "svelte-i18n";
  
  let goto = derived(currCmd, cmd => cmd === gotoCmd);
  let find = derived(currCmd, cmd => cmd === findCmd);
  let replace = derived(currCmd, cmd => cmd === replaceCmd);
</script>

<div id="cmdBar" bind:this={app.cmdBar.el}
     class="fixed left-0 bg w-full flex flex-wrap gap-1 p-1.5"
     use:clickOutside on:click_outside={() => app.cmdBar.close()}
>
  <div class="flex gap-1 items-center flex-wrap">
    <p>
      {#if $goto}{$_('cmdBar.line_nr')}:{/if}
      {#if $find}{$_('cmdBar.find')}:{/if}
      {#if $replace}{$_('cmdBar.replace')}:{/if}
    </p>
    
    <input bind:this={app.cmdBar.inputSearch}
           on:input={() => app.cmdBar.onSearchInput()}
           on:keydown={e => app.cmdBar.onKeyPress(e, true)}
           on:keyup={e => app.cmdBar.onKeyPress(e, false)}
    />
  </div>
  
  <div class="flex gap-1 items-center flex-wrap">
    {#if $replace}<p>{$_('cmdBar.with')}:</p>{/if}
    <input bind:this={app.cmdBar.inputReplace} class:hidden={!$replace}>
  </div>

  <div class="flex gap-1 items-center flex-wrap">
    {#if $replace}
      <button on:click={() => app.cmdBar.runCmd()}>
        <svg xmlns="http://www.w3.org/2000/svg" class="btn p-0.5" width="26" height="26" fill="currentColor" viewBox="0 0 256 256"><path d="M184,104v32a8,8,0,0,1-8,8H99.31l10.35,10.34a8,8,0,0,1-11.32,11.32l-24-24a8,8,0,0,1,0-11.32l24-24a8,8,0,0,1,11.32,11.32L99.31,128H168V104a8,8,0,0,1,16,0Zm48-48V200a16,16,0,0,1-16,16H40a16,16,0,0,1-16-16V56A16,16,0,0,1,40,40H216A16,16,0,0,1,232,56ZM216,200V56H40V200H216Z"></path></svg>
      </button>
    {/if}
    <div bind:this={app.cmdBar.counterEl} id="count"/>
    <button bind:this={app.cmdBar.prevEl} class="btn p-0" on:click={() => app.editor.highlighter.prev()}>◀</button>
    <button bind:this={app.cmdBar.nextEl} class="btn p-0" on:click={() => app.editor.highlighter.next()}>▶</button>
    <button bind:this={app.cmdBar.replaceAllEl} class="btn clear" on:click={() => app.cmdBar.runCmd(true)}>{$_('cmdBar.replace_all')}</button>
    <button bind:this={app.cmdBar.clearEl} class="btn clear" on:click={() => app.cmdBar.clear()}>{$_('cmdBar.clear')}</button>
  </div>
</div>