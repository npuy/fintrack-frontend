import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { deleteAccount } from "~/services/account/account";
import { getToken, userLoggedIn } from "~/services/authentication/middleware";

export async function action({ request, params }: ActionFunctionArgs) {
  const accountId = params.accountId;
  if (!(await userLoggedIn(request)) || !accountId) {
    return redirect("/");
  }
  const token = await getToken(request);
  await deleteAccount({ token, accountId });
  return redirect("/accounts");
}
