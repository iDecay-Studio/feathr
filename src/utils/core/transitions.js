import {fly} from 'svelte/transition';
import {cubicOut} from "svelte/easing";

export function flyIn(node, {y = -5, duration = 150, delay = 0, easing = cubicOut} = {}) {
  if (node.style.animation) node.style = null;
  const options = {delay: delay, y: y, duration: duration, easing: easing};

  return fly(node, options);
}