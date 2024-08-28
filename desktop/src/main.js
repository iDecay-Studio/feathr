import App from "./comp/App.svelte";
import 'uno.css';
import './styles/app.pcss';

const main = new App({
  target: document.getElementById('app')
})

export default main;