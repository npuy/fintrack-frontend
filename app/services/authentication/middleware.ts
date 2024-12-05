import { ActionFunctionArgs } from "@remix-run/node";
import { getSession } from "~/sessions";

export const userLoggedIn = async ({
  request,
}: ActionFunctionArgs): Promise<boolean> => {
  const session = await getSession(request.headers.get("Cookie"));
  return session.has("userId");
};
