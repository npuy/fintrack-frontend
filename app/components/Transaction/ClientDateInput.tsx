import { DateInput } from "@mantine/dates";
import { useEffect, useState } from "react";
import { parseYYYYMMDDToDate } from "~/utils/dates";

interface ClientDateInputProps {
  date?: string;
  submittedDate?: string;
  error?: string[];
}

function toDateValue(value?: string): Date | null {
  if (!value) return null;

  const date = /^\d{4}-\d{2}-\d{2}/.test(value)
    ? parseYYYYMMDDToDate(value)
    : new Date(value);

  return isNaN(date.getTime()) ? null : date;
}

export function ClientDateInput({
  date,
  submittedDate,
  error,
}: ClientDateInputProps) {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) return null;

  const defaultValue =
    toDateValue(submittedDate) ?? toDateValue(date) ?? new Date();

  return (
    <DateInput
      label="Date"
      name="date"
      valueFormat="YYYY/MM/DD"
      defaultValue={defaultValue}
      error={error}
    />
  );
}
