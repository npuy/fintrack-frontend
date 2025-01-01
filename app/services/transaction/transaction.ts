import { ActionFunctionArgs } from "@remix-run/node";
import {
  Transaction,
  TransactionCreate,
  TransactionFull,
} from "~/types/transaction";
import { getToken } from "../authentication/middleware";
import { env } from "~/config/config";

export async function getTransactions({
  request,
}: ActionFunctionArgs): Promise<Transaction[]> {
  const response = await fetch(`${env.BACKEND_URL}/transaction`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: (await getToken({ request } as ActionFunctionArgs)) || "",
    },
  });
  return (await response.json()) as Transaction[];
}

export async function getTransactionsFull({
  request,
}: ActionFunctionArgs): Promise<TransactionFull[]> {
  const response = await fetch(`${env.BACKEND_URL}/transaction/full`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: (await getToken({ request } as ActionFunctionArgs)) || "",
    },
  });
  return (await response.json()) as TransactionFull[];
}

export async function getTransaction({
  request,
  transactionId,
}: ActionFunctionArgs & { transactionId: string }): Promise<Transaction> {
  const response = await fetch(
    `${env.BACKEND_URL}/transaction/${transactionId}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization:
          (await getToken({ request } as ActionFunctionArgs)) || "",
      },
    }
  );
  return (await response.json()) as Transaction;
}

export function validateTransactionData(
  amount: FormDataEntryValue | null,
  description: FormDataEntryValue | null,
  date: FormDataEntryValue | null,
  accountId: FormDataEntryValue | null,
  categoryId: FormDataEntryValue | null,
  type: FormDataEntryValue | null
): TransactionCreate {
  if (
    !amount ||
    !description ||
    !date ||
    !accountId ||
    !categoryId ||
    !type ||
    typeof amount !== "string" ||
    isNaN(parseFloat(amount as string)) ||
    typeof description !== "string" ||
    typeof date !== "string" ||
    isNaN(Date.parse(date as string)) ||
    typeof accountId !== "string" ||
    typeof categoryId !== "string" ||
    typeof type !== "string" ||
    isNaN(parseInt(type as string))
  ) {
    throw new Error("Invalid transaction data");
  }
  return {
    amount: parseFloat(amount as string),
    description: description as string,
    date: new Date(date as string),
    accountId: accountId as string,
    categoryId: categoryId as string,
    type: parseInt(type as string),
  };
}

export async function createTransaction({
  request,
  transactionData,
}: ActionFunctionArgs & { transactionData: TransactionCreate }) {
  await fetch(`${env.BACKEND_URL}/transaction`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: (await getToken({ request } as ActionFunctionArgs)) || "",
    },
    body: JSON.stringify(transactionData),
  });
}

export async function updateTransaction({
  request,
  transactionData,
}: ActionFunctionArgs & { transactionData: TransactionCreate }) {
  await fetch(`${env.BACKEND_URL}/transaction/${transactionData.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: (await getToken({ request } as ActionFunctionArgs)) || "",
    },
    body: JSON.stringify(transactionData),
  });
}

export async function deleteTransaction({
  request,
  transactionId,
}: ActionFunctionArgs & { transactionId: string }) {
  await fetch(`${env.BACKEND_URL}/transaction/${transactionId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: (await getToken({ request } as ActionFunctionArgs)) || "",
    },
  });
}
