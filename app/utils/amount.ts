export function formatAmount(amount: number) {
  return new Intl.NumberFormat("DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function parseAmount(amount: FormDataEntryValue | null) {
  if (!amount) return null;
  const normalized = amount.toString().replace(".", "").replace(",", ".");
  return normalized;
}
