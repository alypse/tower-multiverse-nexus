// Maths //
export const sum = (array: number[]) => array.reduce((curr, next) => curr + next, 0);

export const avg = (array: number[]) => sum(array) / array.length;

export const integerRange = (start: number, end: number) => Array.from({ length: end - start + 1 }, (_, i) => start + i);

/**
 * Returns a supplied numeric expression rounded to the nearest integer while rounding halves to even.
 */
export const roundMidpointToEven = (x: number) => {
  const n = x >= 0 ? 1 : -1 // n describes the adjustment on an odd rounding from midpoint
  const r = n * Math.round(n * x) // multiplying n will fix negative rounding
  return Math.abs(x) % 1 === 0.5 && r % 2 !== 0 ? r - n : r // we adjust by n if we deal with a half on an odd rounded number
}


// Strings //
export const capitalize = (string: string) => (!string?.length ? '' : string.charAt(0).toUpperCase() + string.substring(1).toLowerCase());

export const capitalizeAll = (string: string) => (!string?.length ? '' : string.split(' ').map(capitalize).join(' '));

// JSX Helpers //
export const renderIf = (condition, render) => (condition ? render : null);

export const renderIfElse = (condition, render, elseRender) => (condition ? render : elseRender);

export const unique = array => [...new Set(array)];

export const removeDuplicates = (array: any[]) => array.filter((value, index, self) => self.indexOf(value) === index);

// Objects //

export const objectFromEntries = entries => entries.reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
