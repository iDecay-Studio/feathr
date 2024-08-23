<div id="top"></div>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/justDeek/leaf-editor">
    <img src="/app-icon.png" alt="Logo" width="60" height="60">
  </a>

  <h1 align="center">Leaf Editor</h1>

<h3 align="center">A minimal text editor for Windows, Linux and MacOS.</h2>

  <p align="center">
    Download for:&nbsp;
    <a href="https://denote-csttwfha1-denote.vercel.app/">Windows</a>
    ·
    <a href="https://github.com/justDeek/DeNote/issues">MacOS</a>
    ·
    <a href="https://github.com/justDeek/DeNote/issues">Linux</a>
  </p>
</div>

![Leaf Text Editor](/app-preview.webp)

# About

This project is based on [Parchment](https://github.com/tywil04/parchment) and includes the following changes:
- [x] convert from solid-js to svelte and replace tailwind with unocss;
- [x] custom menubar with common text-editor features and shortcuts;
- [x] implement various features from other open-source text-editors like [Left](https://github.com/hundredrabbits/Left);
- [x] support for multiple baked-in themes;
- [x] support for opening files via drag-and-drop;
- [x] improved search and replace bar and highlighter;
- [x] custom animated caret for a smooth writing experience;
- [ ] recover current progress in case the OS/app crashed;
- [ ] add focus-mode for distraction-free writing;

Used libraries and assets:
- [Svelte](https://svelte.dev/) - for a very performant and lightweight javascript framework;
- [UnoCSS](https://unocss.dev/) - to allow for simple styling of the application;
- [Tauri](https://tauri.app/) - a rust wrapper that allows you to create fast and secure desktop applications using web technologies;
- [Tabler Icons](https://tablericons.com/) - for the few icons used within this application;

This app should work on Windows, MacOS and Linux however it only has been tested on Windows. 

# Usage
Head to the releases page to download pre-built executables.

# Building
Before you build, you need to have everything required installed.\
Follow this [guide](https://tauri.app/v1/guides/getting-started/prerequisites#installing) to install Tauri and its dependencies. 

Once everything needed is installed, run the following commands:
```
git clone https://github.com/justDeek/leaf-editor.git
cd leaf-editor
pnpm install
pnpm build-app
```

Once the build has been completed, you will find the executables in ```src-tauri/target/release/bundle```.