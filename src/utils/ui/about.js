import {open as openWithDefault} from '@tauri-apps/plugin-shell';
import {getVersion} from "@tauri-apps/api/app";

export let version = "";
getVersion().then(data => version = data);

export const openGitHubURL = () => openWithDefault("https://github.com/justDeek/leaf-editor");