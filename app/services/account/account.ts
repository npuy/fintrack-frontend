import { Account, AccountWithBalance } from "~/types/account";
import { getToken } from "~/services/authentication/middleware";
import { ActionFunctionArgs } from "@remix-run/node";
import { env } from "~/config/config";

export async function getAccountsWithBalance({
  request,
}: ActionFunctionArgs): Promise<AccountWithBalance[]> {
  const response = await fetch(`${env.BACKEND_URL}/account/balance`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: (await getToken({ request } as ActionFunctionArgs)) || "",
    },
  });
  return (await response.json()) as AccountWithBalance[];
}

export async function getAccounts({
  request,
}: ActionFunctionArgs): Promise<Account[]> {
  const response = await fetch(`${env.BACKEND_URL}/account`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: (await getToken({ request } as ActionFunctionArgs)) || "",
    },
  });
  return (await response.json()) as Account[];
}

export async function getAccount({
  request,
  accountId,
}: ActionFunctionArgs & { accountId: string }): Promise<Account> {
  const response = await fetch(`${env.BACKEND_URL}/account/${accountId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: (await getToken({ request } as ActionFunctionArgs)) || "",
    },
  });
  return (await response.json()) as Account;
}

export function validateAccountData(
  name: FormDataEntryValue | null,
  currency: FormDataEntryValue | null
) {
  if (
    !name ||
    typeof name !== "string" ||
    !currency ||
    typeof currency !== "string" ||
    typeof Number(currency) !== "number"
  ) {
    throw new Error("Invalid account data");
  }
  return { name: name as string, currencyId: Number(currency) as number };
}

export async function createAccount({
  request,
  name,
  currencyId,
}: ActionFunctionArgs & { name: string; currencyId: number }) {
  await fetch(`${env.BACKEND_URL}/account`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: (await getToken({ request } as ActionFunctionArgs)) || "",
    },
    body: JSON.stringify({ name, currencyId }),
  });
}

export async function editAccount({
  request,
  name,
  accountId,
  currencyId,
}: ActionFunctionArgs & {
  name: string;
  accountId: string;
  currencyId: number;
}) {
  await fetch(`${env.BACKEND_URL}/account/${accountId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: (await getToken({ request } as ActionFunctionArgs)) || "",
    },
    body: JSON.stringify({ name, currencyId }),
  });
}

export async function deleteAccount({
  request,
  accountId,
}: ActionFunctionArgs & { accountId: string }) {
  await fetch(`${env.BACKEND_URL}/account/${accountId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: (await getToken({ request } as ActionFunctionArgs)) || "",
    },
  });
}
