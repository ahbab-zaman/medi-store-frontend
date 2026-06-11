const BDT_FORMATTER = new Intl.NumberFormat("en-BD", {
  style: "currency",
  currency: "BDT",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** Format a numeric amount as Bangladeshi Taka (৳). */
export function formatCurrency(amount: number): string {
  return BDT_FORMATTER.format(amount);
}

/** Compact BDT symbol prefix without locale formatting (for charts). */
export function formatCurrencyCompact(amount: number): string {
  return `৳${amount.toFixed(0)}`;
}
