<script>
  //based on: https://devdojo.com/pines/docs/menubar
  import {app} from "@/utils/core/app.js";
  import {undo, redo, find, replace, copy, cut, paste, selectAutocomplete, selectSynonym, gotoLine, gotoPrevMarker, gotoNextMarker, gotoPrevFile, gotoNextFile} from "@/utils/ui/menu.js";
  import {clickOutside} from "@/utils/events/clickOutside.js";
  import {isMenuOpen} from "@/utils/ui/menu.js";
  import Menu from "@/comp/menu/overlay/Menu.svelte";
  import MenuItem from "@/comp/menu/overlay/MenuItem.svelte";
  import SubMenu from "@/comp/menu/overlay/SubMenu.svelte";
  import MenuDiv from "@/comp/menu/overlay/MenuDiv.svelte";
  
  let caseSensitive = app.settings.caseSensitive.store;
  let matchWords = app.settings.matchWords.store;
  let autoIndent = app.settings.autoIndent.store;
  let showSidebar = app.settings.showSidebar.store;
  let focusMode = app.settings.focusMode.store;
  let wordWrap = app.settings.wordWrap.store;
  let fontType = app.settings.fontType.store;
  let theme = app.settings.theme.store;
</script>

<div class="flex flex-row items-center whitespace-nowrap mr-auto w-full">
  <div class="flex size-full p-0.5 select-none"
       use:clickOutside on:click_outside={() => $isMenuOpen = false}>
    <Menu title="File">
      <MenuItem title="New" shortcut="Ctrl+N" action={() => app.project.newFile()}/>
      <MenuItem title="Open..." shortcut="Ctrl+O" action={() => app.project.openFile()}/>
      <SubMenu title="Open Recent">
        <MenuItem title="Test" action={() => app.project.openFile("C:")}/>
      </SubMenu>
      <MenuItem title="Open in Explorer" shortcut="Ctrl+E" action={() => app.project.openInExplorer()}/>
      <MenuDiv/>
      <MenuItem title="Save" shortcut="Ctrl+S" action={() => app.project.save()}/>
      <MenuItem title="Save as..." shortcut="Ctrl+Shift+S" action={() => app.project.save_as()}/>
      <MenuDiv/>
      <MenuItem title="Discard Changes" shortcut="Ctrl+D" action={() => app.project.discard()}/>
      <MenuItem title="Close File" shortcut="Ctrl+W" action={() => app.project.close()}/>
      <MenuItem title="Quit App" shortcut="Ctrl+Q" action={() => app.quit()}/>
    </Menu>
    
    <Menu title="Edit">
      <MenuItem title="Undo" shortcut="Ctrl+Z" action={undo}/>
      <MenuItem title="Redo" shortcut="Ctrl+Y" action={redo}/>
      <MenuDiv/>
      <MenuItem title="Find..." shortcut="Ctrl+F" action={find}/>
      <MenuItem title="Replace..." shortcut="Ctrl+R" action={replace}/>
      <MenuDiv/>
      <MenuItem title="Cut" shortcut="Ctrl+X" action={cut}/>
      <MenuItem title="Copy" shortcut="Ctrl+C" action={copy}/>
      <MenuItem title="Paste" shortcut="Ctrl+V" action={paste}/>
      <MenuDiv/>
      <MenuItem title="Autocomplete" shortcut="Tab" action={selectAutocomplete}/>
      <MenuItem title="Select Synonym" shortcut="Shift+Tab" action={selectSynonym}/>
    </Menu>
    
    <Menu title="Go">
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
      <SubMenu title="Text">
        <MenuItem title="Auto-Indent" active={$autoIndent} action={() => app.settings.autoIndent.toggle()}/>
        <MenuItem title="Word-Wrap" active={$wordWrap} action={() => app.settings.wordWrap.toggle()}/>
      </SubMenu>
      <SubMenu title="Search">
        <MenuItem title="Case-sensitive" active={$caseSensitive} action={() => app.settings.caseSensitive.toggle()}/>
        <MenuItem title="Match Words" active={$matchWords} action={() => app.settings.matchWords.toggle()}/>
      </SubMenu>
      <SubMenu title="Font Type">
        <MenuItem title="Sans" active={$fontType === "sans"} action={() => app.settings.fontType.set("sans")}/>
        <MenuItem title="Sans-Serif" active={$fontType === "sans-serif"} action={() => app.settings.fontType.set("sans-serif")}/>
        <MenuItem title="Mono" active={$fontType === "mono"} action={() => app.settings.fontType.set("mono")}/>
      </SubMenu>
      <SubMenu title="Font Size">
        <MenuItem title="Increase" shortcut="Ctrl+[+]" action={() => app.settings.fontSize.increase()} closeOnClick={false}/>
        <MenuItem title="Decrease" shortcut="Ctrl+[-]" action={() => app.settings.fontSize.decrease()} closeOnClick={false}/>
        <MenuItem title="Reset" action={() => app.settings.fontSize.reset()} closeOnClick={false}/>
      </SubMenu>
      <SubMenu title="Theme">
        <MenuItem title="System" active={$theme === "system"} action={() => app.settings.theme.set("system")} closeOnClick={false}/>
        <MenuItem title="Light" active={$theme === "light"} action={() => app.settings.theme.set("light")} closeOnClick={false}/>
        <MenuItem title="Dimmed" active={$theme === "dimmed"} action={() => app.settings.theme.set("dimmed")} closeOnClick={false}/>
        <MenuItem title="Cappuccino" active={$theme === "cappuccino"} action={() => app.settings.theme.set("cappuccino")} closeOnClick={false}/>
        <MenuItem title="Dark" active={$theme === "dark"} action={() => app.settings.theme.set("dark")} closeOnClick={false}/>
      </SubMenu>
    </Menu>
  </div>
</div>