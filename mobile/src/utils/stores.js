import {get, writable} from "svelte/store";

export const activeDropdown = writable("");
export const activeMenuItem = writable("");
export const showSidebar = writable(false);
export const showDrawer = writable(false);

export const setActiveDropdown = (item) => {
  if (get(activeDropdown) === item) activeDropdown.set("");
  else activeDropdown.set(item);
}