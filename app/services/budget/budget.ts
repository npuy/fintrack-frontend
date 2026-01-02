import { z } from "zod";

import { env } from "~/config/config";
import {
  BudgetGroup,
  BudgetGroupWithCategoriesAndAmount,
  UpdateBudgetGroupInput,
} from "~/types/budget";
import { parseMultiValue, validateForm } from "~/utils/forms";

export async function getBudgetGroup({
  token,
  budgetId,
}: {
  token?: string;
  budgetId: string;
}): Promise<BudgetGroupWithCategoriesAndAmount> {
  if (budgetId == "new") {
    return {
      id: "new",
      name: "",
      limit: 0,
      currencyId: 1,
      userId: "",
      createdAt: new Date("2000-01-01T00:00:00"),
      updatedAt: new Date("2000-01-01T00:00:00"),
      categories: [],
      amount: 0,
    };
  }
  const response = await fetch(`${env.BACKEND_URL}/budget/${budgetId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: token || "",
    },
  });
  return await response.json();
}

const budgetDataSchema = z.object({
  name: z.string().min(1, "Name is required"),
  limit: z.coerce.number().min(1, "Limit is required"),
  currency: z.coerce.number().min(1, "Currency is required"),
  categories: z.array(z.string()).min(1, "At least one category is required"),
});

export function validateBudgetData(formData: FormData) {
  const values = {
    name: formData.get("name") as string,
    limit: formData.get("limit") as string,
    currency: formData.get("currency") as string,
    categories: parseMultiValue(formData.get("categories") as string),
  };
  return validateForm(values, budgetDataSchema);
}

export async function createBudgetGroup({
  token,
  budgetData,
}: {
  token?: string;
  budgetData: UpdateBudgetGroupInput;
}): Promise<BudgetGroup> {
  const response = await fetch(`${env.BACKEND_URL}/budget`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token || "",
    },
    body: JSON.stringify(budgetData),
  });
  return await response.json();
}

export async function updateBudgetGroup({
  token,
  budgetData,
}: {
  token?: string;
  budgetData: UpdateBudgetGroupInput;
}): Promise<BudgetGroup> {
  const response = await fetch(`${env.BACKEND_URL}/budget/${budgetData.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: token || "",
    },
    body: JSON.stringify(budgetData),
  });
  return await response.json();
}

export async function deleteBudgetGroup({
  token,
  budgetId,
}: {
  token?: string;
  budgetId?: string;
}): Promise<void> {
  await fetch(`${env.BACKEND_URL}/budget/${budgetId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: token || "",
    },
  });
}

export async function getBudgetGroups({
  token,
}: {
  token?: string;
}): Promise<BudgetGroupWithCategoriesAndAmount[]> {
  const response = await fetch(`${env.BACKEND_URL}/budget`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: token || "",
    },
  });
  return await response.json();
}
