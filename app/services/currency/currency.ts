import { env } from "~/config/config";
import { Currency } from "~/types/account";

export async function getCurrencies({
  token,
}: {
  token?: string;
}): Promise<Currency[]> {
  const response = await fetch(`${env.BACKEND_URL}/currency`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: token || "",
    },
  });
  return (await response.json()) as Currency[];
}
