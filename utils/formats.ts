export function formatCurrency(value?: number) {
  if (value === null || value === undefined) return '';
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
}

export function formatNumber(value: number | undefined, digits: number = 2) {
  if (value === null || value === undefined) return '';
  return new Intl.NumberFormat('nl-NL', {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(value);
}
