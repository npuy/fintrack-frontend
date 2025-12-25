import { ActionFunctionArgs } from "@remix-run/node";
import {
  FilterTransactionsInput,
  Transaction,
  TransactionCreate,
  TransactionFullResponse,
} from "~/types/transaction";
import { getToken } from "../authentication/middleware";
import { env } from "~/config/config";
import { formatDateToYYYYMMDD } from "~/utils/dates";
import { z } from "zod";
import { validateForm } from "~/utils/forms";

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
  queryParams,
}: ActionFunctionArgs & {
  queryParams?: string;
}): Promise<TransactionFullResponse> {
  const response = await fetch(
    `${env.BACKEND_URL}/transaction/full?${queryParams}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization:
          (await getToken({ request } as ActionFunctionArgs)) || "",
      },
    }
  );
  if (!response.ok) {
    throw new Error((await response.json()).message);
  }
  return (await response.json()) as TransactionFullResponse;
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

const transactionDataSchema = z.object({
  amount: z.coerce.number().min(0.01, "Amount must be greater than 0"),
  description: z.string().min(1, "Description is required"),
  date: z.coerce.date().min(new Date("2000-01-01"), "Date is required"),
  account: z.string().min(1, "Account is required"),
  category: z.string().min(1, "Category is required"),
  type: z.coerce.number().min(1, "Type is required"),
});

export function validateTransactionData(formData: FormData) {
  const values = {
    amount: formData.get("amount"),
    description: formData.get("description"),
    date: formData.get("date"),
    account: formData.get("account"),
    category: formData.get("category"),
    type: formData.get("type"),
  };

  return validateForm(values, transactionDataSchema);
}

const transferDataSchema = z.object({
  amount: z.coerce
    .number()
    .min(0.01, "Amount must be greater than 0")
    .nullable(),
  description: z.string().min(1, "Description is required"),
  date: z.coerce.date().min(new Date("2000-01-01"), "Date is required"),
  accountFrom: z.string().min(1, "Account from is required"),
  accountTo: z.string().min(1, "Account to is required"),
  category: z.string().min(1, "Category is required"),
  amountFrom: z.coerce
    .number()
    .min(0.01, "Amount from must be greater than 0")
    .nullable(),
  amountTo: z.coerce
    .number()
    .min(0.01, "Amount to must be greater than 0")
    .nullable(),
});

export function validateTransferData(formData: FormData) {
  const values = {
    amount: formData.get("amount"),
    description: formData.get("description"),
    date: formData.get("date"),
    accountFrom: formData.get("accountFrom"),
    accountTo: formData.get("accountTo"),
    category: formData.get("category"),
    amountFrom: formData.get("amountFrom"),
    amountTo: formData.get("amountTo"),
  };

  return validateForm(values, transferDataSchema);
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

export function getQueryParamsFromFormData({
  startDate,
  endDate,
  accountId,
  categoryId,
  type,
}: {
  startDate: FormDataEntryValue | null;
  endDate: FormDataEntryValue | null;
  accountId: FormDataEntryValue | null;
  categoryId: FormDataEntryValue | null;
  type: FormDataEntryValue | null;
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
  if (accountId) queryParams.append("accountId", accountId.toString());
  if (categoryId) queryParams.append("categoryId", categoryId.toString());
  if (type) queryParams.append("type", type.toString());

  return queryParams.toString();
}

export function getFiltersFromUrl(url: URL): FilterTransactionsInput {
  const filters: FilterTransactionsInput = {};

  const startDate = url.searchParams.get("startDate");
  if (startDate) filters.startDate = new Date(startDate);

  const endDate = url.searchParams.get("endDate");
  if (endDate) filters.endDate = new Date(endDate);

  const accountId = url.searchParams.get("accountId");
  if (accountId) filters.accountId = accountId;

  const categoryId = url.searchParams.get("categoryId");
  if (categoryId) filters.categoryId = categoryId;

  const type = url.searchParams.get("type");
  if (type) filters.type = parseInt(type);

  const limit = url.searchParams.get("limit");
  if (limit) filters.limit = parseInt(limit);

  const offset = url.searchParams.get("offset");
  if (offset) filters.offset = parseInt(offset);

  return filters;
}
