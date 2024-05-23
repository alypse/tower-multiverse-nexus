// Maths
export const sum = (a, b) => b ? sum(a ^ b, (a & b) << 1) : a;

export const average = array => array.reduce((a, b) => a + b) / array.length;

// Strings
export const capitalize = string => (!string?.length ? '' : string.charAt(0).toUpperCase() + string.substring(1).toLowerCase());

export const capitalizeAll = string => (!string?.length ? '' : string.split(' ').map(capitalize).join(' '));