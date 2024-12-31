import { getToken } from "~/services/authentication/middleware";
import { ActionFunctionArgs } from "@remix-run/node";
import { Category, CategoryWithBalance } from "~/types/category";
import { env } from "~/config/config";

export async function getCategoriesWithBalance({
  request,
}: ActionFunctionArgs): Promise<CategoryWithBalance[]> {
  const response = await fetch(`${env.BACKEND_URL}/category/balance`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: (await getToken({ request } as ActionFunctionArgs)) || "",
    },
  });
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

export function validateCategoryData(name: FormDataEntryValue | null) {
  if (!name || typeof name !== "string") {
    throw new Error("Invalid category data");
  }
  return { name: name as string };
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
