export const DEFAULT_CURRENCY = "EUR" as const;

export const SUPPORTED_CURRENCIES = [
  "EUR",
  "USD",
  "GBP",
  "CAD",
  "AUD",
  "CHF",
  "JPY",
  "SEK",
  "NOK",
  "DKK",
] as const;

export type CurrencyCode = (typeof SUPPORTED_CURRENCIES)[number];

const CURRENCY_CODE_REGEX = /^[A-Z]{3}$/;

export function isValidCurrencyCode(value: string): value is CurrencyCode {
  return CURRENCY_CODE_REGEX.test(value) && SUPPORTED_CURRENCIES.includes(value as CurrencyCode);
}

export function formatPrice(amount: number, currencyCode: string): string {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currencyCode,
  }).format(amount);
}
