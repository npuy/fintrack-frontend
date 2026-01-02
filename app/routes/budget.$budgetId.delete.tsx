import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { getToken, userLoggedIn } from "~/services/authentication/middleware";
import { deleteBudgetGroup } from "~/services/budget/budget";

export async function action({ request, params }: ActionFunctionArgs) {
  const budgetId = params.budgetId;
  if (!(await userLoggedIn(request)) || !budgetId) {
    return redirect("/");
  }

  const token = await getToken(request);
  await deleteBudgetGroup({ token, budgetId });
  return redirect("/dashboard");
}
