export function niceCount(n) {
  const endings = ['st', 'nd', 'rd', 'th']
  return `${n}${endings[n < 3 ? n - 1 : 3]}`
}
