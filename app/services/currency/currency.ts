import { ActionFunctionArgs } from "@remix-run/node";
import { env } from "~/config/config";
import { Currency } from "~/types/account";
import { getToken } from "../authentication/middleware";

export async function getCurrencies({
  request,
}: ActionFunctionArgs): Promise<Currency[]> {
  const response = await fetch(`${env.BACKEND_URL}/currency`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: (await getToken({ request } as ActionFunctionArgs)) || "",
    },
  });
  return (await response.json()) as Currency[];
}

export async function getCurrencyFromBackend({
  request,
  id,
}: ActionFunctionArgs & { id: number }): Promise<Currency> {
  const response = await fetch(`${env.BACKEND_URL}/currency/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: (await getToken({ request } as ActionFunctionArgs)) || "",
    },
  });
  return (await response.json()) as Currency;
}
