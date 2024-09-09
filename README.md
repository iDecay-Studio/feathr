<div id="top"></div>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/iDecay-Studio/feathr.">
    <img src="/app-icon.png" alt="Logo" width="60" height="60">
  </a>

  <h1 align="center">feathr.</h1>

<h3 align="center">A modern and minimal text editor for desktop and mobile.</h2>

  <p align="center">
    Download for:&nbsp;
    <a href="https://github.com/iDecay-Studio/feathr./releases">Windows</a>
    ·
    <a href="https://github.com/iDecay-Studio/feathr./releases">MacOS</a>
    ·
    <a href="https://github.com/iDecay-Studio/feathr./releases">Linux</a>
  </p>
</div>

![feathr. Text Editor](/app-preview.webp)


# About

This project is based on other open-source editors like [Parchment](https://github.com/tywil04/parchment) and [Left](https://github.com/hundredrabbits/Left) while also adding the following features and more:
- [x] theming - support for multiple baked-in themes;
- [x] drag-and-drop: open files by dragging them into the app;
- [x] menu-bar - custom menubar with common text-editor options and shortcuts;
- [x] command-bar - improved search and replace bar and text-highlighter;
- [x] custom caret - animated input-caret for a smooth writing experience;
- [X] autom. text backup - recover current progress in case the OS/app crashed;
- [X] focus mode - for distraction-free writing;

### Used libraries and assets:

- [Tauri](https://tauri.app/) - a rust wrapper that allows you to create fast and secure desktop applications using web technologies;
- [Svelte](https://svelte.dev/) - performant and modern javascript framework for the frontend;
- [UnoCSS](https://unocss.dev/) - to allow for simple and consistent styling of the application;
- [Tabler Icons](https://tablericons.com/) & [Phosphor Icons](https://phosphoricons.com/) - for the few icons used within this application;


# Project Structure

## Main Folders

- ```desktop``` - the root of the desktop app;
- ```mobile``` - the root of the mobile app;
- ```shared``` - contains the main editor logic as well as styles and components shared between the desktop and mobile app;
- ```src-tauri``` - the source root for the tauri backend;

The ```desktop```, ```mobile```, and ```shared``` folders contain the components, styles, and logic for the frontend as well as the actual editor functionality.

## Main Scripts

Inside ```shared\js``` lies the main script logic for the app with the following structure:
- ```core``` - foundational scripts like the the app.js script and global settings;
  - ```modules``` - the global app features as individual classes;
- ```editor``` - the editor-specific scripts;
    - ```tools``` - editor-related features;
- ```events``` - global event-handling;
- ```ui``` - interface-related scripts for the menus and prompts;

The ```core\app.js``` script is the heart of the application and orchestrates all the modules and editor features.
It initializes and updates the modules and serves as the main entry point for all other scripts to access any app-related functionality.


# Usage
Head to the [releases](https://github.com/iDecay-Studio/feathr./releases) page to download pre-built executables.


# Building

## Setup

Before you build, you need to have everything required installed.\
Follow this [guide](https://tauri.app/v1/guides/getting-started/prerequisites#installing) to install Tauri and its dependencies. 

After everything is installed, run the following commands:
```
git clone https://github.com/iDecay-Studio/feathr..git
cd feathr.
bun install
```

## 🖥️ Desktop

run: ```bun app-build```
Once the build has been completed, you will find the executables in ```src-tauri/target/release/bundle```.


## 🤖 Android

[Android Studio and a few other steps will be required](https://v2.tauri.app/guides/prerequisites/#android) to get things up and running.
> Note: When installing Android Studio via JetBrains Toolbox on Windows, the JAVA_HOME path is located at: ```C:\Users\<User>\AppData\Local\Programs\Android Studio\jbr```

Once that's done, you can initialize the project:
```bun tauri android init```

Open Android Studio and run the development build:
```bun android-dev```

This command should open the Android emulator and the app shortly after.
If everything is working correctly, you can build the mobile app via: ```bun android-build```


## 🍎 iOS

[Check the prerequisites](https://v2.tauri.app/guides/prerequisites/#ios) for having iOS ready to run (MacOS only).

Once that is done, let’s create the XCode project:
```bun tauri ios init```

If everything runs successfully, you can start the development server:
```bun tauri ios dev --open```

This command will open XCode with your project, select the simulator and get ready to run.