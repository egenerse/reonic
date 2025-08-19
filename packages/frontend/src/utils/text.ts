export function toDecimal(number: number) {
  return number.toLocaleString("de-DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export function toGermanNumber(number: number) {
  return number.toLocaleString("de-DE")
}
