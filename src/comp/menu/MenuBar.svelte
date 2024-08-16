<script>
  //based on: https://devdojo.com/pines/docs/menubar
  import {newFile, open, openFile, openInExplorer, saveFile, saveFileAs, discardChanges, closeFile, closeApp} from "@/utils/editor/file.js";
  import {undo, redo, find, replace, copy, cut, paste} from "@/utils/ui/menu.js";
  import {clickOutside} from "@/utils/events/clickOutside.js";
  import {isMenuOpen} from "@/utils/ui/menu.js";
  import {defFontSize, focusMode, wordWrap, fontType, fontSize, theme, setFocusMode, setWordWrap, setFontType, setTheme, setFontSize, incrFontSizeBy} from "@/utils/core/settings.js";
  import Menu from "@/comp/menu/overlay/Menu.svelte";
  import MenuItem from "@/comp/menu/overlay/MenuItem.svelte";
  import SubMenu from "@/comp/menu/overlay/SubMenu.svelte";
  import MenuDiv from "@/comp/menu/overlay/MenuDiv.svelte";
</script>

<div class="flex flex-row items-center whitespace-nowrap mr-auto max-h-[40px] border-gray-200 dark:border-gray-700 bg-gray-100/50 dark:bg-gray-800/50 w-full">
  <div use:clickOutside on:click_outside={() => isMenuOpen.set(false)} class="relative top-0 left-0 z-50 w-auto transition-all duration-150 ease-out">
    <div class="relative top-0 left-0 z-40 w-auto h-8 transition duration-200 ease-out">
      <div class="w-full h-full p-1 border-none bg-gray-100/50 dark:bg-gray-800/50 border rounded-md">
        <div class="flex justify-between w-full h-full select-none text-neutral-900">
          <Menu title="File">
            <MenuItem title="New" shortcut="Ctrl+N" action={newFile}/>
            <MenuItem title="Open..." shortcut="Ctrl+O" action={openFile}/>
            <SubMenu title="Open Recent">
              <MenuItem title="Test" action={() => open("C:")}/>
            </SubMenu>
            <MenuItem title="Open in Explorer" shortcut="Ctrl+E" action={openInExplorer}/>
            <MenuDiv/>
            <MenuItem title="Save" shortcut="Ctrl+S" action={saveFile}/>
            <MenuItem title="Save as..." shortcut="Ctrl+Shift+S" action={saveFileAs}/>
            <MenuDiv/>
            <MenuItem title="Discard Changes" shortcut="Ctrl+D" action={discardChanges}/>
            <MenuItem title="Close File" shortcut="Ctrl+W" action={closeFile}/>
            <MenuItem title="Quit App" shortcut="Ctrl+Q" action={closeApp}/>
          </Menu>
          
          <Menu title="Edit">
            <MenuItem title="Undo" shortcut="Ctrl+Z" action={undo}/>
            <MenuItem title="Redo" shortcut="Ctrl+Y" action={redo} disabled={true}/>
            <MenuDiv/>
            <MenuItem title="Find" shortcut="Ctrl+F" action={find}/>
            <MenuItem title="Find & Replace" shortcut="Ctrl+R" action={replace}/>
            <MenuDiv/>
            <MenuItem title="Cut" shortcut="Ctrl+X" action={cut}/>
            <MenuItem title="Copy" shortcut="Ctrl+C" action={copy}/>
            <MenuItem title="Paste" shortcut="Ctrl+V" action={paste}/>
          </Menu>
          
          <Menu title="View">
            <MenuItem title="Focus Mode" shortcut="Ctrl+Enter" action={() => setFocusMode(!$focusMode)}/>
            <MenuDiv/>
            <MenuItem title="Word-Wrap" active={$wordWrap} action={() => setWordWrap(!$wordWrap)} closeOnClick={false}/>
            <SubMenu title="Font Type">
              <MenuItem title="Sans" active={$fontType === "sans"} action={() => setFontType("sans")} closeOnClick={false}/>
              <MenuItem title="Sans-Serif" active={$fontType === "sans-serif"} action={() => setFontType("sans-serif")} closeOnClick={false}/>
              <MenuItem title="Mono" active={$fontType === "mono"} action={() => setFontType("mono")} closeOnClick={false}/>
            </SubMenu>
            <SubMenu title="Font Size">
              <MenuItem title="Increase" shortcut="Ctrl+[+]" action={() => setFontSize($fontSize + incrFontSizeBy)} closeOnClick={false}/>
              <MenuItem title="Decrease" shortcut="Ctrl+[-]" action={() => setFontSize($fontSize - incrFontSizeBy)} closeOnClick={false}/>
              <MenuItem title="Reset" action={() => setFontSize(defFontSize)} closeOnClick={false}/>
            </SubMenu>
            <SubMenu title="Theme">
              <MenuItem title="Light" active={$theme === "light"} action={() => setTheme("light")} closeOnClick={false}/>
              <MenuItem title="Dark" active={$theme === "dark"} action={() => setTheme("dark")} closeOnClick={false}/>
            </SubMenu>
          </Menu>
        </div>
      </div>
    </div>
  </div>
</div>