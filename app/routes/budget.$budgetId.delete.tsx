import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { getToken, userLoggedIn } from "~/services/authentication/middleware";
import { deleteBudgetGroup } from "~/services/budget/budget";

export async function action({ request, params }: ActionFunctionArgs) {
  const token = await getToken({ request } as ActionFunctionArgs);
  if (!(await userLoggedIn({ request } as ActionFunctionArgs)) || !token) {
    return redirect("/");
  }

  const budgetId = params.budgetId as string;
  await deleteBudgetGroup({ token, budgetId });
  return redirect("/dashboard");
}
