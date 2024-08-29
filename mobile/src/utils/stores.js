import {get, writable} from "svelte/store";

export const activeDropdown = writable("");
export const showDrawer = writable(false);
export const drawerItems = writable([]);

export const setActiveDropdown = (item) => {
  if (get(activeDropdown) === item) activeDropdown.set("");
  else activeDropdown.set(item);
}