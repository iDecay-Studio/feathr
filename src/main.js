import Editor from "./comp/Editor.svelte";
import {init as initSettings} from "@/utils/settings.js";
import 'uno.css';
import './styles/app.pcss';

const app = new Editor({
  target: document.getElementById('app')
})

initSettings();

export default app