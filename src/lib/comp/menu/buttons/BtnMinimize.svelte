<script>
  import {appWindow} from "@tauri-apps/api/window";
</script>

<button class="!p-1 btn btn-green" onClick={() => appWindow.minimize()}>
  <svg class="h-4 w-4 header-text" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
</button>