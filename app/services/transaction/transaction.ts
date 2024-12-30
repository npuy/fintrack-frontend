import { ActionFunctionArgs } from "@remix-run/node";
import { Transaction } from "~/types/transaction";
import { getToken } from "../authentication/middleware";

export async function getTransactions({
  request,
}: ActionFunctionArgs): Promise<Transaction[]> {
  const response = await fetch("http://localhost:8000/transaction", {
    headers: {
      "Content-Type": "application/json",
      Authorization: (await getToken({ request } as ActionFunctionArgs)) || "",
    },
  });
  return (await response.json()) as Transaction[];
}
