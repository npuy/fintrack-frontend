import { z } from "zod";
import { ActionFunctionArgs } from "@remix-run/node";
import { validateForm } from "~/utils/forms";
import { env } from "~/config/config";
import { getToken } from "../authentication/middleware";

const settingsDataSchema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  currency: z.coerce.number().min(1, "Currency is required"),
  name: z.string().min(1, "Name is required"),
  payDay: z.coerce
    .number()
    .int()
    .min(1, "Pay day is required")
    .max(31, "Pay day must be between 1 and 31"),
});

export function validateUpdateUserData(formData: FormData) {
  const values = {
    email: formData.get("email"),
    currency: formData.get("currency"),
    name: formData.get("name"),
    payDay: formData.get("payDay"),
  };

  return validateForm(values, settingsDataSchema);
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
