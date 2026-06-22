const CURRENCY_SYMBOL: Record<string, string> = {
  USD: '$',
  EUR: '€',
  JPY: '¥',
}

export function formatPrice(
  price: number | string | null,
  currency: string
): string {
  if (price === null || price === '') return ''
  const amount = Number(price)
  if (!Number.isFinite(amount)) return ''
  const symbol = CURRENCY_SYMBOL[currency] ?? `${currency} `
  const rounded = Number.isInteger(amount) ? amount : Math.round(amount)
  return `${symbol}${rounded}`
}
