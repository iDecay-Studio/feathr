<div id="top"></div>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/iDecay-Studio/feathr">
    <img src="/app-icon.png" alt="Logo" width="60" height="60">
  </a>

  <h1 align="center">feathr.</h1>

  <h3 align="center">A modern and minimal text editor for desktop and mobile.</h2>

  <p align="center">
    Download for:&nbsp;
    <a href="https://github.com/iDecay-Studio/feathr/releases">Windows</a>
    ·
    <a href="https://github.com/iDecay-Studio/feathr/releases">MacOS</a>
    ·
    <a href="https://github.com/iDecay-Studio/feathr/releases">Linux</a>
  </p>
</div>

![feathr. Text Editor](/assets/app-preview.webp)


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


# Installation
Head to the [releases](https://github.com/iDecay-Studio/feathr/releases) page to download the preferred pre-built executable.

- **Linux**: Download the `.AppImage` or `.deb` file and install it.
- **macOS**: Download the `.dmg` file, then drag **Tau** to your Applications folder.
- **Windows**: Download the`.exe` or `.msi` executable and run it.
> If you encounter a SmartScreen warning, it’s because I haven't purchased a Microsoft code-signing certificate yet.\
> The app is safe to use, the source code is available for review, and you can also scan the executable with [VirusTotal](https://www.virustotal.com/gui/home/upload).\
> \
> To install:\
> Click "More info."\
> Click "Run anyway."\
> <img src="https://raw.githubusercontent.com/iDecay-Studio/feathr/main/assets/windowsSmartscreen.png"/>


# Building

## Setup

Before you build, you need to have everything required installed.\
Follow this [guide](https://tauri.app/v1/guides/getting-started/prerequisites#installing) to install Tauri and its dependencies. 

After everything is installed, run the following commands to setup your local repository:
```
git clone https://github.com/iDecay-Studio/feathr.git
cd feathr
bun install
```


## 🖥️ Desktop

run: ```bun run app-build```\
Once the build has been completed, you will find the executables in ```src-tauri/target/release/bundle```.


## 🤖 Android

[Android Studio and a few other steps will be required](https://v2.tauri.app/guides/prerequisites/#android) to get things up and running.
> Note: When installing Android Studio via JetBrains Toolbox on Windows, the JAVA_HOME path is located at: ```C:\Users\<User>\AppData\Local\Programs\Android Studio\jbr```

Once that's done, you can initialize the project with:
```bun run android-init```
> Whenever you make changes to the Cargo dependencies or when you encounter some error messages unrelated to your code changes, run ```bun run android-init``` to re-initialize the ```src-tauri\gen\android``` folder.

Open Android Studio and run the development build:
```bun android-dev```\
This command should open the Android emulator and the app shortly after.\
> When multiple android emulators are being detected, enter the index matching the desired emulator (e.g. ```Medium_Phone_API_35```).\
> On some newer emulator versions, INFO is being listed as a device option. To fix this, [downgrade](https://github.com/expo/expo/issues/27440#issuecomment-1980049767) your emulator to the latest stable version.

If everything is working correctly, you can build the mobile app via: ```bun android-build```

In order to upload the app to Google Play Console, it needs to be signed by following [this](https://v2.tauri.app/distribute/sign/android/) guide.
___
When the app starts with the following warning: *This app was build for an older version of Android*,
go to ```src-tauri/gen/android/app/build.gradle.kts``` and insert ```targetSdk = 34``` inside ```android { defaultConfig { ... } }```.


## 🍎 iOS

[Check the prerequisites](https://v2.tauri.app/guides/prerequisites/#ios) for having iOS ready to run (MacOS only).

Once that is done, let’s create the XCode project:
```tauri ios init```

If everything runs successfully, you can start the development server with:\
```tauri ios dev --open```

This command will open XCode with your project. Select the simulator and run the app.


<p align="right">(<a href="#top">back to top</a>)</p>