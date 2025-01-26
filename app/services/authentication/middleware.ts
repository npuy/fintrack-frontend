import { ActionFunctionArgs } from "@remix-run/node";
import { getSession } from "~/sessions";
import { Currency } from "~/types/account";
import { User } from "~/types/user";

export async function userLoggedIn({
  request,
}: ActionFunctionArgs): Promise<boolean> {
  const session = await getSession(request.headers.get("Cookie"));
  return session.has("authToken");
}

export async function getUser({
  request,
}: ActionFunctionArgs): Promise<User | undefined> {
  const session = await getSession(request.headers.get("Cookie"));
  return session.get("user");
}

export async function getToken({
  request,
}: ActionFunctionArgs): Promise<string | undefined> {
  const session = await getSession(request.headers.get("Cookie"));
  return session.get("authToken");
}

export async function getCurrency({
  request,
}: ActionFunctionArgs): Promise<Currency | undefined> {
  const session = await getSession(request.headers.get("Cookie"));
  return session.get("userCurrency");
}
