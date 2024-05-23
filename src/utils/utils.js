export const getSum = (a,b) => b ? getSum(a ^ b, (a & b) << 1) : a;
export const average = array => array.reduce((a, b) => a + b) / array.length;