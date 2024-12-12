import { ActionFunctionArgs } from "@remix-run/node";
import { getSession } from "~/sessions";

export async function userLoggedIn({
  request,
}: ActionFunctionArgs): Promise<boolean> {
  const session = await getSession(request.headers.get("Cookie"));
  return session.has("authToken");
}
