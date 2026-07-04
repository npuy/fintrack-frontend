import { DateInput } from "@mantine/dates";
import { useEffect, useState } from "react";
import { parseYYYYMMDDToDate } from "~/utils/dates";

interface ClientDateInputProps {
  date?: string;
  submittedDate?: string;
  error?: string[];
}

const today = new Date();
// Default to current date if no date is provided
const defaultDate = `${today.getFullYear()}-${
  today.getMonth() + 1
}-${today.getDate()}`;

export function ClientDateInput({
  date,
  submittedDate,
  error,
}: ClientDateInputProps) {
  const [dateValue, setDateValue] = useState<Date | null>(null);

  useEffect(() => {
    function toClientDateValue(value?: string): Date | null {
      if (!value) return null;

      const date = /^\d{4}-\d{2}-\d{2}/.test(value)
        ? parseYYYYMMDDToDate(value)
        : new Date(value);

      return isNaN(date.getTime()) ? null : date;
    }

    setDateValue(toClientDateValue(submittedDate ?? date ?? defaultDate));
  }, [date, submittedDate]);

  if (!dateValue)
    return (
      <DateInput
        label="Date"
        name="date"
        valueFormat="YYYY/MM/DD"
        error={error}
      />
    );

  return (
    <DateInput
      label="Date"
      name="date"
      valueFormat="YYYY/MM/DD"
      value={dateValue}
      onChange={setDateValue}
      error={error}
    />
  );
}
