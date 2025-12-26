import { getSession } from "~/sessions";
import { Currency } from "~/types/account";
import { User } from "~/types/user";

export async function userLoggedIn(request: Request): Promise<boolean> {
  const session = await getSession(request.headers.get("Cookie"));
  return session.has("authToken");
}

export async function getUser(request: Request): Promise<User | undefined> {
  const session = await getSession(request.headers.get("Cookie"));
  return session.get("user");
}

export async function getToken(request: Request): Promise<string | undefined> {
  const session = await getSession(request.headers.get("Cookie"));
  return session.get("authToken");
}

export async function getCurrency(
  request: Request
): Promise<Currency | undefined> {
  const session = await getSession(request.headers.get("Cookie"));
  return session.get("userCurrency");
}
