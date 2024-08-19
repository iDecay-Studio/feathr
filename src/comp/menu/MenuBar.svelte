<script>
  //based on: https://devdojo.com/pines/docs/menubar
  import app from "@/utils/core/app.js";
  import {newFile, open, openFile, openInExplorer, saveFile, saveFileAs, discardChanges, closeFile} from "@/utils/editor/file.js";
  import {undo, redo, find, replace, copy, cut, paste, selectAutocomplete, selectSynonym, gotoLine, gotoPrevMarker, gotoNextMarker, gotoPrevFile, gotoNextFile} from "@/utils/ui/menu.js";
  import {clickOutside} from "@/utils/events/clickOutside.js";
  import {isMenuOpen} from "@/utils/ui/menu.js";
  import Menu from "@/comp/menu/overlay/Menu.svelte";
  import MenuItem from "@/comp/menu/overlay/MenuItem.svelte";
  import SubMenu from "@/comp/menu/overlay/SubMenu.svelte";
  import MenuDiv from "@/comp/menu/overlay/MenuDiv.svelte";
  
  $: autoIndent = app.settings.autoIndent.store;
  $: showSidebar = app.settings.showSidebar.store;
  $: focusMode = app.settings.focusMode.store;
  $: wordWrap = app.settings.wordWrap.store;
  $: fontType = app.settings.fontType.store;
  $: theme = app.settings.theme.store;
</script>

<div class="flex flex-row items-center whitespace-nowrap mr-auto max-h-[40px] border-gray-200 dark:border-gray-700 bg-gray-100/50 dark:bg-gray-800/50 w-full">
  <div use:clickOutside on:click_outside={() => $isMenuOpen = false} class="relative top-0 left-0 z-50 w-auto transition-all duration-150 ease-out">
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
            <MenuItem title="Quit App" shortcut="Ctrl+Q" action={() => app.quit()}/>
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
            <MenuDiv/>
            <MenuItem title="Autocomplete" shortcut="Tab" action={selectAutocomplete}/>
            <MenuItem title="Select Synonym" shortcut="Shift+Tab" action={selectSynonym}/>
            <MenuItem title="Auto-Indent" active={$autoIndent} action={() => app.settings.autoIndent.toggle()}/>
          </Menu>
          
          <Menu title="Go to">
            <MenuItem title="Line..." shortcut="Ctrl+G" action={gotoLine}/>
            <MenuItem title="Prev. Marker" shortcut="Ctrl+Up" action={gotoPrevMarker}/>
            <MenuItem title="Next Marker" shortcut="Ctrl+Down" action={gotoNextMarker}/>
            <MenuItem title="Prev. File" shortcut="Ctrl+Left" action={gotoPrevFile}/>
            <MenuItem title="Next File" shortcut="Ctrl+Right" action={gotoNextFile}/>
          </Menu>

          <Menu title="View">
            <MenuItem title="Show Sidebar" active={$showSidebar} shortcut="Ctrl+Tab" action={() => app.settings.showSidebar.toggle()}/>
            <MenuItem title="Focus Mode" active={$focusMode} shortcut="Ctrl+Enter" action={() => app.settings.focusMode.toggle()}/>
            <MenuDiv/>
            <MenuItem title="Word-Wrap" active={$wordWrap} action={() => app.settings.wordWrap.toggle()} closeOnClick={false}/>
            <SubMenu title="Font Type">
              <MenuItem title="Sans" active={$fontType === "sans"} action={() => () => app.settings.fontType.set("sans")} closeOnClick={false}/>
              <MenuItem title="Sans-Serif" active={$fontType === "sans-serif"} action={() => app.settings.fontType.set("sans-serif")} closeOnClick={false}/>
              <MenuItem title="Mono" active={$fontType === "mono"} action={() => app.settings.fontType.set("mono")} closeOnClick={false}/>
            </SubMenu>
            <SubMenu title="Font Size">
              <MenuItem title="Increase" shortcut="Ctrl+[+]" action={() => app.settings.fontSize.increase()} closeOnClick={false}/>
              <MenuItem title="Decrease" shortcut="Ctrl+[-]" action={() => app.settings.fontSize.decrease()} closeOnClick={false}/>
              <MenuItem title="Reset" action={() => app.settings.fontSize.reset()} closeOnClick={false}/>
            </SubMenu>
            <SubMenu title="Theme">
              <MenuItem title="Light" active={$theme === "light"} action={() => app.settings.theme.set("light")} closeOnClick={false}/>
              <MenuItem title="Dark" active={$theme === "dark"} action={() => app.settings.theme.set("dark")} closeOnClick={false}/>
            </SubMenu>
          </Menu>
        </div>
      </div>
    </div>
  </div>
</div>