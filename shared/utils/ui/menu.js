import {app} from "@leaf/shared/utils/core/app.js";
import {exec} from "@leaf/shared/utils/core/utils.js";
import {findCmd, gotoCmd, replaceCmd} from "@leaf/shared/utils/core/modules/cmdBar.js";
import {writable} from "svelte/store";

//states
export let isMenuOpen = writable(false);
export let openMenu = writable("");

let recentFilesMenu = [
  {title:"Test", action:() => console.log('test')},
];

export const fileMenu = [
  {title:"New", shortcut:"Ctrl+N", action:() => app.project.newFile()},
  {title:"Open...", shortcut:"Ctrl+O", action:() => app.project.openFile()},
  {title:"Open Recent", submenu: recentFilesMenu},
  {title:"Open in Explorer", shortcut:"Ctrl+E", action:() => app.project.openInExplorer()},
  {divider:true},
  {title:"Save", shortcut:"Ctrl+S", action:() => app.project.save()},
  {title:"Save as...", shortcut:"Ctrl+Shift+S", action:() => app.project.save_as()},
  {divider:true},
  {title:"Discard Changes", shortcut:"Ctrl+D", action:() => app.project.discard()},
  {title:"Close File", shortcut:"Ctrl+W", action:() => app.project.close()},
  {title:"Quit App", shortcut:"Ctrl+Q", action:() => app.quit()},
];

export const editMenu = [
  {title:"Undo", shortcut:"Ctrl+Z", action:() => exec("undo")},
  {title:"Redo", shortcut:"Ctrl+Y", action:() => exec("redo")},
  {divider:true},
  {title:"Find...", shortcut:"Ctrl+F", action:() => app.cmdBar.open(findCmd)},
  {title:"Replace...", shortcut:"Ctrl+R", action:() => app.cmdBar.open(replaceCmd)},
  {divider:true},
  {title:"Cut", shortcut:"Ctrl+X", action:() => exec("cut")},
  {title:"Copy", shortcut:"Ctrl+C", action:() => exec("copy")},
  {title:"Paste", shortcut:"Ctrl+V", action:() => exec("paste")},
  {divider:true},
  {title:"Autocomplete", shortcut:"Tab", action:() => app.editor.select.autocomplete()},
  {title:"Select Synonym", shortcut:"Shift+Tab", action:() => app.editor.select.synonym()},
];

export const goMenu = [
  {title:"Line...", shortcut:"Ctrl+G", action:() => app.cmdBar.open(gotoCmd)},
  {title:"Prev. Marker", shortcut:"Ctrl+Up", action:() => app.sidebar.prev_marker()},
  {title:"Next Marker", shortcut:"Ctrl+Down", action:() => app.sidebar.next_marker()},
  {title:"Prev. File", shortcut:"Ctrl+Left", action:() => app.sidebar.prev_page()},
  {title:"Next File", shortcut:"Ctrl+Right", action:() => app.sidebar.next_page()},
];

export const viewMenu = [
  {title:"Show Sidebar", shortcut:"Ctrl+Tab", setting:app.settings.showSidebar},
  {title:"Focus Mode", shortcut:"Ctrl+Enter", setting:app.settings.focusMode},
  {divider:true},
  {title:"Text", submenu: [
    {title:"Auto-Indent", setting:app.settings.autoIndent},
    {title:"Word-Wrap", setting:app.settings.wordWrap},
  ]},
  {title:"Search", submenu: [
    {title:"Case-sensitive", setting:app.settings.caseSensitive},
    {title:"Match Words", setting:app.settings.matchWords},
  ]},
  {title:"Font Type", submenu: [
    {title:"Sans", setting:app.settings.fontType, compareTo:"sans"},
    {title:"Sans-Serif", setting:app.settings.fontType, compareTo:"sans-serif"},
    {title:"Mono", setting:app.settings.fontType, compareTo:"mono"},
  ]},
  {title:"Font Size", submenu: [
    {title:"Increase", shortcut:"Ctrl+[+]", action:() => app.settings.fontSize.increase(), closeMenu:false},
    {title:"Decrease", shortcut:"Ctrl+[-]", action:() => app.settings.fontSize.decrease(), closeMenu:false},
    {title:"Reset", action:() => app.settings.fontSize.reset(), closeMenu:false},
  ]},
  {title:"Theme", submenu: [
    {title:"System", setting:app.settings.theme, compareTo:"system", closeMenu:false},
    {title:"Light", setting:app.settings.theme, compareTo:"light", closeMenu:false},
    {title:"Dimmed", setting:app.settings.theme, compareTo:"dimmed", closeMenu:false},
    {title:"Cappuccino", setting:app.settings.theme, compareTo:"cappuccino", closeMenu:false},
    {title:"Dark", setting:app.settings.theme, compareTo:"dark", closeMenu:false},
  ]},
];