import app from "@feathr/shared/js/core/app.js";
import {findCmd, gotoCmd, replaceCmd} from "@feathr/shared/js/core/modules/cmdBar.js";
import {exec, getFileNameFromPath, openLink} from "@feathr/shared/js/core/utils.js";
import {checkForUpdates} from "@feathr/shared/js/core/modules/updater.js";
import {derived, get, writable} from "svelte/store";
import {format} from 'svelte-i18n';

//states
export let isMenuOpen = writable(false);
export let openMenu = writable("");

export async function setRecentFilesMenu() {
  let result = [];
  let recentPaths = await app.settings.recentPaths.get();
  recentPaths.forEach(path => result.push({path:path, title: getFileNameFromPath(path), action: () => app.file.open(path)}));

  get(fileMenu)[2].submenu = result;
}

export async function onPathChange(path) {
  get(fileMenu)[3].disabled = !path || path === "";
}

export let fileMenu = derived(format, _ => [
  {title:_('file.new'), shortcut:"Ctrl+N", action:() => app.file.new()},
  {title:_('file.open')+"...", shortcut:"Ctrl+O", action:() => app.file.openWithDialog()},
  {title:_('file.open_recent'), id:'recentPaths', submenu: []},
  {title:_('file.open_folder'), shortcut:"Ctrl+E", action:() => app.file.openFolder()},
  {divider:true},
  {title:_('file.save'), shortcut:"Ctrl+S", action:() => app.file.save()},
  {title:_('file.save_as')+"...", shortcut:"Ctrl+Shift+S", action:() => app.file.saveAs()},
  {divider:true},
  {title:_('file.discard_changes'), shortcut:"Ctrl+D", action:() => app.file.discardChanges()},
  {title:_('file.quit_app'), shortcut:"Ctrl+Q", action:() => app.quit(true), color:'red', hideOnMobile:true},
]);

export const editMenu = derived(format, _ => [
  {title:_('edit.undo'), shortcut:"Ctrl+Z", action:() => exec("undo")},
  {title:_('edit.redo'), shortcut:"Ctrl+Y", action:() => exec("redo")},
  {divider:true},
  {title:_('edit.find')+"...", shortcut:"Ctrl+F", action:() => app.cmdBar.open(findCmd)},
  {title:_('edit.replace')+"...", shortcut:"Ctrl+R", action:() => app.cmdBar.open(replaceCmd)},
  {divider:true, hideOnMobile:true},
  {title:_('edit.cut'), shortcut:"Ctrl+X", action:() => exec("cut"), hideOnMobile:true},
  {title:_('edit.copy'), shortcut:"Ctrl+C", action:() => exec("copy"), hideOnMobile:true},
  {title:_('edit.paste'), shortcut:"Ctrl+V", action:() => exec("paste"), hideOnMobile:true},
]);

export const goMenu = derived(format, _ => [
  {title:_('go.line')+"...", shortcut:"Ctrl+G", action:() => app.cmdBar.open(gotoCmd)},
  {title:_('go.prev_marker'), shortcut:"Ctrl+Up", action:() => app.sidebar.prev_marker(), hideOnMobile:true},
  {title:_('go.next_marker'), shortcut:"Ctrl+Down", action:() => app.sidebar.next_marker(), hideOnMobile:true},
  // {title:_('go.prev_file'), shortcut:"Ctrl+Left", action:() => app.file.prev()},
  // {title:_('go.next_file'), shortcut:"Ctrl+Right", action:() => app.file.next()},
]);

export const helpMenu = derived(format, _ => [
  {title:_('help.contact'), action:() => openLink("https://www.idecay.de/contact"), isLink:true},
  {title:_('help.donate'), action:() => openLink("https://ko-fi.com/just_deek"), isLink:true},
  {title:_('help.about'), action:() => openLink("https://github.com/iDecay-Studio/feathr"), isLink:true},
  {title:_('help.check_updates'), action:() => checkForUpdates(true), hideOnMobile:true},
  // {title:"DEBUG", submenu: [
  //     {title:"Get Path", action:() => log(app.file.getPath()), closeMenu:false},
  //     {title:"Get Stats", action:async () => log(await app.file.getStats()), closeMenu:false},
  //   ]},
]);

export const settingsMenu = derived(format, _ => [
  {title:_('settings.language'), submenu: [
      {title:_('settings.english'), setting:() => app.settings.language, compareTo:"en-US", closeMenu:false},
      {title:_('settings.german'), setting:() => app.settings.language, compareTo:"de-DE", closeMenu:false},
    ]},
  {title:_('settings.theme'), id:'theme', submenu: [
      {title:_('settings.theme_system'), setting:() => app.settings.theme, compareTo:"system", closeMenu:false},
      {title:_('settings.theme_bright'), setting:() => app.settings.theme, compareTo:"bright", closeMenu:false},
      {title:_('settings.theme_creamy'), setting:() => app.settings.theme, compareTo:"creamy", closeMenu:false},
      {title:_('settings.theme_dimmed'), setting:() => app.settings.theme, compareTo:"dimmed", closeMenu:false},
      {title:_('settings.theme_mocha'), setting:() => app.settings.theme, compareTo:"mocha", closeMenu:false},
      {title:_('settings.theme_ocean'), setting:() => app.settings.theme, compareTo:"ocean", closeMenu:false},
      {title:_('settings.theme_dark'), setting:() => app.settings.theme, compareTo:"dark", closeMenu:false},
      {title:_('settings.theme_noir'), setting:() => app.settings.theme, compareTo:"noir", closeMenu:false},
    ]},
  {title:_('settings.font_size'), submenu: [
      {title:_('settings.increase'), shortcut:"Ctrl+[+]", action:() => app.settings.fontSize.increase(), closeMenu:false},
      {title:_('settings.decrease'), shortcut:"Ctrl+[-]", action:() => app.settings.fontSize.decrease(), closeMenu:false},
      {title:_('settings.reset'), shortcut:"Ctrl+0", action:() => app.settings.fontSize.reset(), closeMenu:false},
    ]},
  {title:_('settings.font_type'), submenu: [
      {title:_('settings.sans'), setting:() => app.settings.fontType, compareTo:"sans", closeMenu:false},
      {title:_('settings.sans_serif'), setting:() => app.settings.fontType, compareTo:"sans-serif", closeMenu:false},
      {title:_('settings.mono'), setting:() => app.settings.fontType, compareTo:"mono", closeMenu:false},
    ]},
  {title:_('settings.search'), submenu: [
      {title:_('settings.case_sensitive'), setting:() => app.settings.caseSensitive, closeMenu:false},
      {title:_('settings.match_words'), setting:() => app.settings.matchWords, closeMenu:false},
    ]},
  {title:_('settings.editor'), submenu: [
      {title:_('settings.auto_indent'), setting:() => app.settings.autoIndent, closeMenu:false},
      {title:_('settings.word_wrap'), setting:() => app.settings.wordWrap, closeMenu:false},
    ]},
  {title:_('settings.view'), wide:true, hideOnMobile:true, submenu: [
      {title:_('settings.show_sidebar'), shortcut:"Shift+Tab", setting:() => app.settings.showSidebar},
      {title:_('settings.focus_mode'), shortcut:"Ctrl+Enter", setting:() => app.settings.focusMode},
      // {title:_('settings.close_to_tray'), setting:() => app.settings.closeToTray, hideOnMobile:true},
    ]},
  {title:_('settings.reset_all'), action:() => {app.settings.resetAll()}, color:'red'},
]);