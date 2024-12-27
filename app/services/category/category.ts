import { getToken } from "~/services/authentication/middleware";
import { ActionFunctionArgs } from "@remix-run/node";
import { Category, CategoryWithBalance } from "~/types/category";

export async function getCategoriesWithBalance({
  request,
}: ActionFunctionArgs): Promise<CategoryWithBalance[]> {
  const response = await fetch("http://localhost:8000/category/balance", {
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
  const response = await fetch(`http://localhost:8000/category/${categoryId}`, {
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
    console.log(name);
    throw new Error("Invalid category data");
  }
  return { name: name as string };
}

export async function createCategory({
  request,
  name,
}: ActionFunctionArgs & { name: string }) {
  await fetch("http://localhost:8000/category", {
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
  await fetch(`http://localhost:8000/category/${categoryId}`, {
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
  await fetch(`http://localhost:8000/category/${categoryId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: (await getToken({ request } as ActionFunctionArgs)) || "",
    },
  });
}
