import { z } from "zod";

import { Account, AccountWithBalance } from "~/types/account";
import { env } from "~/config/config";
import { validateForm } from "~/utils/forms";

export async function getAccountsWithBalance({
  token,
}: {
  token?: string;
}): Promise<AccountWithBalance[]> {
  const response = await fetch(`${env.BACKEND_URL}/account/balance`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: token || "",
    },
  });
  return (await response.json()) as AccountWithBalance[];
}

export async function getAccounts({
  token,
}: {
  token?: string;
}): Promise<Account[]> {
  const response = await fetch(`${env.BACKEND_URL}/account`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: token || "",
    },
  });
  return (await response.json()) as Account[];
}

export async function getAccount({
  token,
  accountId,
}: {
  token?: string;
  accountId: string;
}): Promise<Account> {
  const response = await fetch(`${env.BACKEND_URL}/account/${accountId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: token || "",
    },
  });
  return (await response.json()) as Account;
}

const accountDataSchema = z.object({
  name: z.string().min(1, "Name is required"),
  currency: z.coerce.number().min(1, "Currency is required"),
});

export function validateAccountData(formData: FormData) {
  const values = {
    name: formData.get("name") as string,
    currency: formData.get("currency") as string,
  };
  return validateForm(values, accountDataSchema);
}

export async function createAccount({
  token,
  name,
  currencyId,
}: {
  token?: string;
  name: string;
  currencyId: number;
}) {
  await fetch(`${env.BACKEND_URL}/account`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token || "",
    },
    body: JSON.stringify({ name, currencyId }),
  });
}

export async function editAccount({
  token,
  name,
  accountId,
  currencyId,
}: {
  token?: string;
  name: string;
  accountId: string;
  currencyId: number;
}) {
  await fetch(`${env.BACKEND_URL}/account/${accountId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: token || "",
    },
    body: JSON.stringify({ name, currencyId }),
  });
}

export async function deleteAccount({
  token,
  accountId,
}: {
  token?: string;
  accountId: string;
}) {
  await fetch(`${env.BACKEND_URL}/account/${accountId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: token || "",
    },
  });
}
