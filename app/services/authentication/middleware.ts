import { ActionFunctionArgs } from "@remix-run/node";
import { getSession } from "~/sessions";
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
