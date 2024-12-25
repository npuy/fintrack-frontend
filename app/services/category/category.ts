import { getToken } from "~/services/authentication/middleware";
import { ActionFunctionArgs } from "@remix-run/node";
import { CategoryWithBalance } from "~/types/category";

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
