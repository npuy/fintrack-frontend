import { ActionFunctionArgs } from "@remix-run/node";
import { env } from "~/config/config";
import { getToken } from "../authentication/middleware";

export function validateUpdateUserData({
  email,
  currencyId,
  name,
  payDay,
}: {
  email: FormDataEntryValue | null;
  currencyId: FormDataEntryValue | null;
  name: FormDataEntryValue | null;
  payDay: FormDataEntryValue | null;
}) {
  if (
    !email ||
    !currencyId ||
    !name ||
    !payDay ||
    typeof email !== "string" ||
    typeof currencyId !== "string" ||
    typeof name !== "string" ||
    isNaN(Number(currencyId)) ||
    typeof payDay !== "string" ||
    isNaN(Number(payDay))
  ) {
    throw new Error("Invalid update user data");
  }
  return {
    email: email as string,
    currencyId: Number(currencyId),
    name: name as string,
    payDay: Number(payDay),
  };
}

export async function updateUserData({
  request,
  email,
  currencyId,
  name,
  payDay,
}: ActionFunctionArgs & {
  email: string;
  currencyId: number;
  name: string;
  payDay: number;
}) {
  await fetch(`${env.BACKEND_URL}/user`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: (await getToken({ request } as ActionFunctionArgs)) || "",
    },
    body: JSON.stringify({ email, currencyId, name, payDay }),
  });
}
