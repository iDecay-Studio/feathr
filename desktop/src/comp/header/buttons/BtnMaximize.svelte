<script>
  import {getCurrentWindow} from '@tauri-apps/api/window';
  import {inApp} from "@feathr/shared/js/core/utils.js";
</script>

<button class="btn btn-yellow px-1" on:click={() => inApp && getCurrentWindow().toggleMaximize()}>
  <svg class="size-5.5 p-0.5" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <rect x="4" y="4" width="16" height="16" rx="2"/>
  </svg>
</button>