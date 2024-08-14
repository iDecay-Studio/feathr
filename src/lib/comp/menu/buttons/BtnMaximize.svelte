<script>
  import {appWindow} from "@tauri-apps/api/window";
</script>

<button class="!p-1 btn btn-yellow" onClick={() => appWindow.maximize()}>
  <svg class="h-3 w-3 header-text" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <rect x="4" y="4" width="16" height="16" rx="2"/>
  </svg>
</button>