import { formatCurrency, formatNumber } from '@/utils';

describe('formatCurrency', () => {
  it('formats a number as currency', () => {
    expect(formatCurrency(1234.56)).toBe('US$ 1.234,56');
  });

  it('returns an empty string for undefined', () => {
    expect(formatCurrency(undefined)).toBe('');
  });
});

describe('formatNumber', () => {
  it('formats a number with default digits', () => {
    expect(formatNumber(1234.567)).toBe('1.234,57');
  });

  it('formats a number with specified digits', () => {
    expect(formatNumber(1234.567, 1)).toBe('1.234,6');
  });

  it('returns an empty string for undefined', () => {
    expect(formatNumber(undefined)).toBe('');
  });
});
