function componentToHex(c) {
  const hex = c.toString(16);
  return hex.length === 1 ? `0${hex}` : hex;
}

export function toHex(c) {
  return `#${componentToHex(c[0])}${componentToHex(c[1])}${componentToHex(c[2])}`;
}

export function around(n, m, margin) {
  return (n > m - margin && n < m + margin);
}

export function arrayToRGB(c) {
  return `rgba(${c[0]},${c[1]},${c[2]},${c[3]})`;
}
