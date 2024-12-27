import { Account, AccountWithBalance } from "~/types/account";
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

export async function getAccount({
  request,
  accountId,
}: ActionFunctionArgs & { accountId: string }): Promise<Account> {
  const response = await fetch(`http://localhost:8000/account/${accountId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: (await getToken({ request } as ActionFunctionArgs)) || "",
    },
  });
  return (await response.json()) as AccountWithBalance;
}

export function validateAccountData(name: FormDataEntryValue | null) {
  if (!name || typeof name !== "string") {
    console.log(name);
    throw new Error("Invalid account data");
  }
  return { name: name as string };
}

export async function createAccount({
  request,
  name,
}: ActionFunctionArgs & { name: string }) {
  await fetch("http://localhost:8000/account", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: (await getToken({ request } as ActionFunctionArgs)) || "",
    },
    body: JSON.stringify({ name }),
  });
}

export async function editAccount({
  request,
  name,
  accountId,
}: ActionFunctionArgs & {
  name: string;
  accountId: string;
}) {
  await fetch(`http://localhost:8000/account/${accountId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: (await getToken({ request } as ActionFunctionArgs)) || "",
    },
    body: JSON.stringify({ name }),
  });
}

export async function deleteAccount({
  request,
  accountId,
}: ActionFunctionArgs & { accountId: string }) {
  await fetch(`http://localhost:8000/account/${accountId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: (await getToken({ request } as ActionFunctionArgs)) || "",
    },
  });
}
