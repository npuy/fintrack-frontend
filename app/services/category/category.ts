import { getToken } from "~/services/authentication/middleware";
import { ActionFunctionArgs } from "@remix-run/node";
import {
  Category,
  CategoryFiltersInput,
  CategoryWithBalance,
} from "~/types/category";
import { env } from "~/config/config";
import { formatDateToYYYYMMDD } from "~/utils/dates";
import { z } from "zod";
import { validateForm } from "~/utils/forms";

export async function getCategoriesWithBalance({
  request,
  queryParams,
}: ActionFunctionArgs & {
  queryParams?: string;
}): Promise<CategoryWithBalance[]> {
  const response = await fetch(
    `${env.BACKEND_URL}/category/balance?${queryParams}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          (await getToken({ request } as ActionFunctionArgs)) || "",
      },
    }
  );
  return (await response.json()) as CategoryWithBalance[];
}

export async function getCategories({
  request,
}: ActionFunctionArgs): Promise<Category[]> {
  const response = await fetch(`${env.BACKEND_URL}/category`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: (await getToken({ request } as ActionFunctionArgs)) || "",
    },
  });
  return (await response.json()) as CategoryWithBalance[];
}

export async function getCategory({
  request,
  categoryId,
}: ActionFunctionArgs & { categoryId: string }): Promise<Category> {
  const response = await fetch(`${env.BACKEND_URL}/category/${categoryId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: (await getToken({ request } as ActionFunctionArgs)) || "",
    },
  });
  return (await response.json()) as Category;
}

const categoriesDataSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

export function validateCategoryData(formData: FormData) {
  const values = {
    name: formData.get("name") as string,
  };
  return validateForm(values, categoriesDataSchema);
}

export async function createCategory({
  request,
  name,
}: ActionFunctionArgs & { name: string }) {
  await fetch(`${env.BACKEND_URL}/category`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: (await getToken({ request } as ActionFunctionArgs)) || "",
    },
    body: JSON.stringify({ name }),
  });
}

export async function editCategory({
  request,
  name,
  categoryId,
}: ActionFunctionArgs & {
  name: string;
  categoryId: string;
}) {
  await fetch(`${env.BACKEND_URL}/category/${categoryId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: (await getToken({ request } as ActionFunctionArgs)) || "",
    },
    body: JSON.stringify({ name }),
  });
}

export async function deleteCategory({
  request,
  categoryId,
}: ActionFunctionArgs & { categoryId: string }) {
  await fetch(`${env.BACKEND_URL}/category/${categoryId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: (await getToken({ request } as ActionFunctionArgs)) || "",
    },
  });
}

export function getQueryParamsFromFormData({
  startDate,
  endDate,
}: {
  startDate: FormDataEntryValue | null;
  endDate: FormDataEntryValue | null;
}): string {
  const queryParams = new URLSearchParams();

  if (startDate)
    queryParams.append(
      "startDate",
      formatDateToYYYYMMDD(new Date(startDate.toString()))
    );
  if (endDate)
    queryParams.append(
      "endDate",
      formatDateToYYYYMMDD(new Date(endDate.toString()))
    );

  return queryParams.toString();
}

export function getCategoryFiltersFromUrl(url: URL): CategoryFiltersInput {
  const filters: CategoryFiltersInput = {};

  const startDate = url.searchParams.get("startDate");
  if (startDate) filters.startDate = startDate;

  const endDate = url.searchParams.get("endDate");
  if (endDate) filters.endDate = endDate;

  return filters;
}
