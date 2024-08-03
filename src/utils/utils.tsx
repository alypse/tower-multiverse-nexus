// Maths //
export const sum = array => array.reduce((curr, next) => curr + next, 0);

export const avg = array => sum(array) / array.length;

export const integerRange = (start, end) => Array.from({ length: end - start + 1 }, (_, i) => start + i);

// Strings //
export const capitalize = string => (!string?.length ? '' : string.charAt(0).toUpperCase() + string.substring(1).toLowerCase());

export const capitalizeAll = string => (!string?.length ? '' : string.split(' ').map(capitalize).join(' '));

// JSX Helpers //
export const renderIf = (condition, render) => (condition ? render : null);

export const renderIfElse = (condition, render, elseRender) => (condition ? render : elseRender);

export const unique = array => [...new Set(array)];

export const removeDuplicates = array => array.filter((value, index, self) => self.indexOf(value) === index);

// Objects //

export const objectFromEntries = entries => entries.reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
