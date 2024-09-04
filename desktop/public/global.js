/** @description Shorthand for console.log(). */
var log = console.log.bind(window.console)
/** @description Shorthand for console.warn(). */
// var warn = console.warn.bind(window.console)
/** @description Shorthand for console.error(). */
// var error = console.error.bind(window.console)

/** @description Check if the given value is empty/invalid. */
const isEmpty = (variable) => typeof variable === 'undefined';

/** @description Determine if an array contains one or more items from another array.
 * @return {boolean} true|false If haystack contains at least one item from arr. */
// String.prototype.contains = function contains(...arr) {
//   return arr.some(v => this.includes(v));
// }