// Maths //
export const sum = (array) => array.reduce((curr, next) => curr + next, 0);

export const avg = (array) => sum(array) / array.length;

// Strings //
export const capitalize = string => (!string?.length ? '' : string.charAt(0).toUpperCase() + string.substring(1).toLowerCase());

export const capitalizeAll = string => (!string?.length ? '' : string.split(' ').map(capitalize).join(' '));