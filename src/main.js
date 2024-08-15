import Editor from "./comp/Editor.svelte";
import 'uno.css';
import './styles/app.pcss';

if (window.matchMedia('(prefers-color-scheme: dark)').matches === true) {
  document.querySelector("html").classList.add("dark");
}

window.matchMedia('(prefers-color-scheme: dark)').addEventListener("change", event => {
  if (event.matches) {
    document.querySelector("html").classList.add("dark");
  } else {
    document.querySelector("html").classList.remove("dark");
  }
});

const app = new Editor({
  target: document.getElementById('app')
})

export default app