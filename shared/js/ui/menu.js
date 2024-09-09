import app from "@/shared/js/core/app.js";
import {exec, getFileNameFromPath, openLink} from "@/shared/js/core/utils.js";
import {findCmd, gotoCmd, replaceCmd} from "@/shared/js/core/modules/cmdBar.js";
import {writable} from "svelte/store";

//states
export let isMenuOpen = writable(false);
export let openMenu = writable("");

export async function setRecentFilesMenu() {
  let result = [];
  let recentPaths = await app.settings.recentPaths.get();
  recentPaths.forEach(path => result.push({title: getFileNameFromPath(path), action: () => app.file.open(path)}));
  
  fileMenu[2].submenu = result;
}

export const fileMenu = [
  {title:"New", shortcut:"Ctrl+N", action:() => app.file.new()},
  {title:"Open...", shortcut:"Ctrl+O", action:() => app.file.openWithDialog()},
  {title:"Open Recent", submenu: []},
  {title:"Open in Explorer", shortcut:"Ctrl+E", action:() => app.file.openInExplorer(), hideOnMobile:true},
  {divider:true},
  {title:"Save", shortcut:"Ctrl+S", action:() => app.file.save()},
  {title:"Save as...", shortcut:"Ctrl+Shift+S", action:() => app.file.saveAs()},
  {divider:true},
  {title:"Discard Changes", shortcut:"Ctrl+D", action:() => app.file.discardChanges()},
  {title:"Quit App", shortcut:"Ctrl+Q", action:() => app.quit(), color:'red'},
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
  // {divider:true},
  // {title:"Autocomplete", shortcut:"Tab", action:() => app.editor.selection.autocomplete()},
  // {title:"Select Synonym", shortcut:"Shift+Tab", action:() => app.editor.selection.synonym()},
];

export const goMenu = [
  {title:"Line...", shortcut:"Ctrl+G", action:() => app.cmdBar.open(gotoCmd)},
  {title:"Prev. Marker", shortcut:"Ctrl+Up", action:() => app.sidebar.prev_marker(), hideOnMobile:true},
  {title:"Next Marker", shortcut:"Ctrl+Down", action:() => app.sidebar.next_marker(), hideOnMobile:true},
  {title:"Prev. File", shortcut:"Ctrl+Left", action:() => app.file.prev()},
  {title:"Next File", shortcut:"Ctrl+Right", action:() => app.file.next()},
];

export const helpMenu = [
  {title:"Contact", action:() => openLink("https://www.idecay.de/contact"), isLink:true},
  {title:"Donate", action:() => openLink("https://ko-fi.com/just_deek"), isLink:true},
  {title:"About", action:() => openLink("https://github.com/iDecay-Studio/feathr."), isLink:true},
]

export const settingsMenu = [
  {title:"Font Size", submenu: [
    {title:"Increase", shortcut:"Ctrl+[+]", action:() => app.settings.fontSize.increase(), closeMenu:false},
    {title:"Decrease", shortcut:"Ctrl+[-]", action:() => app.settings.fontSize.decrease(), closeMenu:false},
    {title:"Reset", action:() => app.settings.fontSize.reset(), closeMenu:false},
  ]},
  {title:"Font Type", submenu: [
    {title:"Sans", setting:() => app.settings.fontType, compareTo:"sans"},
    {title:"Sans-Serif", setting:() => app.settings.fontType, compareTo:"sans-serif"},
    {title:"Mono", setting:() => app.settings.fontType, compareTo:"mono"},
  ]},
  {title:"Search", submenu: [
    {title:"Case-sensitive", setting:() => app.settings.caseSensitive},
    {title:"Match Words", setting:() => app.settings.matchWords},
  ]},
  {title:"Text", submenu: [
    {title:"Auto-Indent", setting:() => app.settings.autoIndent},
    {title:"Word-Wrap", setting:() => app.settings.wordWrap},
  ]},
  {title:"Theme", submenu: [
    {title:"System", setting:() => app.settings.theme, compareTo:"system", closeMenu:false},
    {title:"Bright", setting:() => app.settings.theme, compareTo:"bright", closeMenu:false},
    {title:"Creamy", setting:() => app.settings.theme, compareTo:"creamy", closeMenu:false},
    {title:"Dimmed", setting:() => app.settings.theme, compareTo:"dimmed", closeMenu:false},
    {title:"Mocha", setting:() => app.settings.theme, compareTo:"mocha", closeMenu:false},
    {title:"Ocean", setting:() => app.settings.theme, compareTo:"ocean", closeMenu:false},
    {title:"Dark", setting:() => app.settings.theme, compareTo:"dark", closeMenu:false},
    {title:"Noir", setting:() => app.settings.theme, compareTo:"noir", closeMenu:false},
  ]},
  {title:"View", wide:true, hideOnMobile:true, submenu: [
    {title:"Show Sidebar", shortcut:"Ctrl+Tab", setting:() => app.settings.showSidebar},
    {title:"Focus Mode", shortcut:"Ctrl+Enter", setting:() => app.settings.focusMode},
  ]},
  {title:"Reset All", action:() => {app.settings.resetAll()}, color:'red'},
];