<script>
  import { getCurrentWindow } from '@tauri-apps/api/window';
</script>

<button class="btn btn-green px-1" on:click={() => getCurrentWindow().minimize()}>
  <svg class="size-5 p-0.2" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
</button>