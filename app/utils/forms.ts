import { z } from "zod";

type PrimitiveFormValue = string;

type ValidationResult<T> =
  | { success: true; data: T }
  | {
      success: false;
      errors: Partial<Record<keyof T, string[]>>;
      values: Partial<Record<keyof T, PrimitiveFormValue>>;
    };

export function validateForm<T extends z.ZodRawShape>(
  values: unknown,
  schema: z.ZodObject<T>
): ValidationResult<z.infer<typeof schema>> {
  const result = schema.safeParse(values);

  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors as Partial<
        Record<keyof z.infer<typeof schema>, string[]>
      >,
      values: values as Partial<
        Record<keyof z.infer<typeof schema>, PrimitiveFormValue>
      >,
    };
  }

  return {
    success: true,
    data: result.data,
  };
}

export function toMultiValue(value: PrimitiveFormValue | undefined): string[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

export function toDateValue(
  value: PrimitiveFormValue | undefined
): Date | null {
  if (!value) return null;
  const date = new Date(value);
  return isNaN(date.getTime()) ? null : date;
}

// Parses a string separated by , to string[]
export function parseMultiValue(value: string): string[] {
  if (typeof value === "string") {
    return value.split(",").map((v) => v.trim());
  }
  return [];
}
