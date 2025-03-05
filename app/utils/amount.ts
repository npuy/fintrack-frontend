export function formatAmount(amount: number) {
  return new Intl.NumberFormat("DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
