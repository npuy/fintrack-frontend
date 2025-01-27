import { ActionFunctionArgs } from "@remix-run/node";
import { env } from "~/config/config";
import { getToken } from "../authentication/middleware";

export function validateUpdateUserData({
  email,
  currencyId,
  name,
}: {
  email: FormDataEntryValue | null;
  currencyId: FormDataEntryValue | null;
  name: FormDataEntryValue | null;
}) {
  if (
    !email ||
    !currencyId ||
    !name ||
    typeof email !== "string" ||
    typeof currencyId !== "string" ||
    typeof name !== "string" ||
    typeof Number(currencyId) !== "number"
  ) {
    throw new Error("Invalid update user data");
  }
  return {
    email: email as string,
    currencyId: Number(currencyId),
    name: name as string,
  };
}

export async function updateUserData({
  request,
  email,
  currencyId,
  name,
}: ActionFunctionArgs & {
  email: string;
  currencyId: number;
  name: string;
}) {
  await fetch(`${env.BACKEND_URL}/user`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: (await getToken({ request } as ActionFunctionArgs)) || "",
    },
    body: JSON.stringify({ email, currencyId, name }),
  });
}
