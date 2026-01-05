export function formatAmount(amount: number) {
  return new Intl.NumberFormat("DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function parseAmount(amount: FormDataEntryValue | null) {
  if (!amount) return 0;
  const normalized = amount.toString().replace(".", "").replace(",", ".");
  return normalized;
}
