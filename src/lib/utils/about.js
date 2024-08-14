import {open as openInBrowser} from '@tauri-apps/api/shell';
import {getVersion} from "@tauri-apps/api/app"

export let version = "";
getVersion().then(data => version = data);

export const openGitHubURL = () => openInBrowser("https://github.com/tywil04/tauri-notepad");