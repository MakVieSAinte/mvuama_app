export function countryCodeToFlag(code: string) {
  if (!code || code.length !== 2) return ''
  const firstChar = code.charCodeAt(0) - 65 + 0x1f1e6
  const secondChar = code.charCodeAt(1) - 65 + 0x1f1e6
  return String.fromCodePoint(firstChar, secondChar)
}
