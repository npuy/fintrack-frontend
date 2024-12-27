import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { deleteAccount } from "~/services/account/account";
import { userLoggedIn } from "~/services/authentication/middleware";

export async function action({ request, params }: ActionFunctionArgs) {
  if (!(await userLoggedIn({ request } as ActionFunctionArgs))) {
    return redirect("/");
  }
  const accountId = params.accountId;
  await deleteAccount({ request, accountId } as ActionFunctionArgs & {
    accountId: string;
  });
  return redirect("/accounts");
}
