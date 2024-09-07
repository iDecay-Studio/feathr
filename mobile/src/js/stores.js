import {get, writable} from "svelte/store";
import {tick} from "svelte";
import {isMenuOpen} from "@leaf/shared/js/ui/menu.js";

export const activeDropdown = writable("");
export const showDrawer = writable(false);
export const drawerItems = writable([]);

export const setActiveDropdown = (item) => {
  if (get(activeDropdown) === item) activeDropdown.set("");
  else activeDropdown.set(item);
}

export const setDrawerItems = (items) => {
  items = items.filter(item => !item.hideOnMobile);
  if (items.length === 0) return;
  
  drawerItems.set([]);
  showDrawer.set(true);
  tick().then(() => {
    drawerItems.set(items);
    isMenuOpen.set(false);
  });
}