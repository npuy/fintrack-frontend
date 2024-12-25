import { AccountWithBalance } from "~/types/account";
import { getToken } from "~/services/authentication/middleware";
import { ActionFunctionArgs } from "@remix-run/node";

export async function getAccountsWithBalance({
  request,
}: ActionFunctionArgs): Promise<AccountWithBalance[]> {
  const response = await fetch("http://localhost:8000/account/balance", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: (await getToken({ request } as ActionFunctionArgs)) || "",
    },
  });
  return (await response.json()) as AccountWithBalance[];
}
