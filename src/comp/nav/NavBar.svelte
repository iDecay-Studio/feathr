<script>
  import {newFile, open, openFile, openInExplorer, saveFile, saveFileAs, discardChanges, closeFile, closeApp} from "@/utils/editor.js";
  import {undo, redo, find, replace, copy, cut, paste} from "@/utils/menu.js";
  import {clickOutside} from "@/utils/events/clickOutside.js";
  import {isMenuOpen} from "@/utils/menu.js";
  import {defFontSize, focusMode, wordWrap, fontType, fontSize, theme, setFocusMode, setWordWrap, setFontType, setTheme, setFontSize, incrFontSizeBy} from "@/utils/settings.js";
  import NavMenu from "@/comp/nav/NavMenu.svelte";
  import NavMenuItem from "@/comp/nav/NavMenuItem.svelte";
  import NavSubMenu from "@/comp/nav/NavSubMenu.svelte";
  import NavMenuDiv from "@/comp/nav/NavMenuDiv.svelte";
</script>

<div use:clickOutside on:click_outside={() => isMenuOpen.set(false)} class="relative top-0 left-0 z-50 w-auto transition-all duration-150 ease-out">
  <div class="relative top-0 left-0 z-40 w-auto h-8 transition duration-200 ease-out">
    <div class="w-full h-full p-1 border-none bg-gray-100/50 dark:bg-gray-800/50 border rounded-md">
      <div class="flex justify-between w-full h-full select-none text-neutral-900">
        <NavMenu title="File">
          <NavMenuItem title="New" shortcut="Ctrl+N" action={newFile}/>
          <NavMenuItem title="Open..." shortcut="Ctrl+O" action={openFile}/>
          <NavSubMenu title="Open Recent">
            <NavMenuItem title="Test" action={() => open("C:")}/>
          </NavSubMenu>
          <NavMenuItem title="Open in Explorer" shortcut="Ctrl+E" action={openInExplorer}/>
          <NavMenuDiv/>
          <NavMenuItem title="Save" shortcut="Ctrl+S" action={saveFile}/>
          <NavMenuItem title="Save as..." shortcut="Ctrl+Shift+S" action={saveFileAs}/>
          <NavMenuDiv/>
          <NavMenuItem title="Discard Changes" shortcut="Ctrl+D" action={discardChanges}/>
          <NavMenuItem title="Close File" shortcut="Ctrl+W" action={closeFile}/>
          <NavMenuItem title="Quit App" shortcut="Ctrl+Q" action={closeApp}/>
        </NavMenu>
        
        <NavMenu title="Edit">
          <NavMenuItem title="Undo" shortcut="Ctrl+Z" action={undo}/>
          <NavMenuItem title="Redo" shortcut="Ctrl+Y" action={redo} disabled={true}/>
          <NavMenuDiv/>
          <NavMenuItem title="Find" shortcut="Ctrl+F" action={find}/>
          <NavMenuItem title="Find & Replace" shortcut="Ctrl+R" action={replace}/>
          <NavMenuDiv/>
          <NavMenuItem title="Cut" shortcut="Ctrl+X" action={cut}/>
          <NavMenuItem title="Copy" shortcut="Ctrl+C" action={copy}/>
          <NavMenuItem title="Paste" shortcut="Ctrl+V" action={paste}/>
        </NavMenu>
        
        <NavMenu title="View">
          <NavMenuItem title="Focus Mode" shortcut="Ctrl+Enter" action={() => setFocusMode(!$focusMode)}/>
          <NavMenuDiv/>
          <NavMenuItem title="Word-Wrap" active={$wordWrap} action={() => setWordWrap(!$wordWrap)} closeOnClick={false}/>
          <NavSubMenu title="Font Type">
            <NavMenuItem title="Sans" active={$fontType === "sans"} action={() => setFontType("sans")} closeOnClick={false}/>
            <NavMenuItem title="Sans-Serif" active={$fontType === "sans-serif"} action={() => setFontType("sans-serif")} closeOnClick={false}/>
            <NavMenuItem title="Mono" active={$fontType === "mono"} action={() => setFontType("mono")} closeOnClick={false}/>
          </NavSubMenu>
          <NavSubMenu title="Font Size">
            <NavMenuItem title="Increase" shortcut="Ctrl+[+]" action={() => setFontSize($fontSize + incrFontSizeBy)} closeOnClick={false}/>
            <NavMenuItem title="Decrease" shortcut="Ctrl+[-]" action={() => setFontSize($fontSize - incrFontSizeBy)} closeOnClick={false}/>
            <NavMenuItem title="Reset" action={() => setFontSize(defFontSize)} closeOnClick={false}/>
          </NavSubMenu>
          <NavSubMenu title="Theme">
            <NavMenuItem title="Light" active={$theme === "light"} action={() => setTheme("light")} closeOnClick={false}/>
            <NavMenuItem title="Dark" active={$theme === "dark"} action={() => setTheme("dark")} closeOnClick={false}/>
          </NavSubMenu>
        </NavMenu>
      </div>
    </div>
  </div>
</div>