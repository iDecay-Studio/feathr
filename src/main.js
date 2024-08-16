import App from "./comp/App.svelte";
import {init as initSettings} from "@/utils/settings.js";
import 'uno.css';
import './styles/app.pcss';

const app = new App({
  target: document.getElementById('app')
})

initSettings();

export default app