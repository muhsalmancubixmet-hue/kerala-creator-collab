export type Currency = { code: string; symbol: string; locale: string };

export const currencies: Record<string, Currency> = {
  USD: { code: "USD", symbol: "$", locale: "en-US" },
  EUR: { code: "EUR", symbol: "€", locale: "de-DE" },
  GBP: { code: "GBP", symbol: "£", locale: "en-GB" },
  AED: { code: "AED", symbol: "AED", locale: "en-AE" },
  INR: { code: "INR", symbol: "₹", locale: "en-IN" },
  CAD: { code: "CAD", symbol: "CA$", locale: "en-CA" },
  AUD: { code: "AUD", symbol: "A$", locale: "en-AU" },
  SAR: { code: "SAR", symbol: "SAR", locale: "en-SA" },
  SGD: { code: "SGD", symbol: "S$", locale: "en-SG" },
};

export const defaultCurrency = "USD";

/**
 * Format currency amount using international number formatter.
 */
export function formatMoney(
  amount: number | null | undefined,
  currency: string = defaultCurrency,
  compact = false,
): string {
  if (amount == null) return "Contact for price";
  const cfg = currencies[currency] ?? currencies[defaultCurrency]!;
  return new Intl.NumberFormat(cfg.locale, {
    style: "currency",
    currency: cfg.code,
    maximumFractionDigits: 0,
    notation: compact ? "compact" : "standard",
  }).format(amount);
}

/**
 * Format currency range string (e.g. '₹20K–₹50K' or 'From ₹10K').
 */
export function formatRange(
  min: number | null | undefined,
  max: number | null | undefined,
  currency: string = "INR",
): string {
  if (min == null) return "Contact for pricing";
  if (max == null) return `From ${formatMoney(min, currency, true)}`;
  return `${formatMoney(min, currency, true)}–${formatMoney(max, currency, true)}`;
}

/**
 * Format follower count into compact human readable string (e.g. 1.2K, 3.4M).
 */
export function formatFollowers(count: number | null | undefined): string {
  if (count == null || isNaN(count) || count <= 0) return "0";
  if (count >= 1_000_000_000) {
    return `${(count / 1_000_000_000).toFixed(1).replace(/\.0$/, "")}B`;
  }
  if (count >= 1_000_000) {
    return `${(count / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  }
  if (count >= 1_000) {
    return `${(count / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  }
  return String(count);
}

/**
 * Normalize and clean handle / slug string.
 */
export function cleanHandle(raw: string | null | undefined): string {
  if (!raw) return "";
  return raw.trim().replace(/^@+/, "").toLowerCase();
}
