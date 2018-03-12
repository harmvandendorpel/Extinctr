export function niceCount(n) {
  const endings = ['st', 'rd', 'th']
  return `${n}${endings[n < 3 ? n : 2]}`
}
