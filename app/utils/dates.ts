/**
 * Formats a `Date` instance into an ISO-like `YYYY-MM-DD` string.
 * Pads month and day with leading zeros to ensure two digits each.
 */
export function formatDateToYYYYMMDD(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/**
 * Converts a `YYYY-MM-DDT...` string into `DD/MM/YYYY` format without validation.
 */
export function formatYYYYMMDDToDDMMYYYY(dateString: string): string {
  dateString = dateString.split("T")[0]; // Remove time part if present
  const [year, month, day] = dateString.split("-");
  return `${day}/${month}/${year}`;
}

/**
 * Converts a `YYYY-MM-DDT...` string into Date object
 */
export function parseYYYYMMDDToDate(dateString: string): Date {
  dateString = dateString.split("T")[0]; // Remove time part if present
  const [year, month, day] = dateString.split("-").map((s) => Number(s));
  const monthIndex = month - 1;
  return new Date(year, monthIndex, day);
}
