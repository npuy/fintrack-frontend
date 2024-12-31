import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { userLoggedIn } from "~/services/authentication/middleware";
import { deleteTransaction } from "~/services/transaction/transaction";

export async function action({ request, params }: ActionFunctionArgs) {
  if (!(await userLoggedIn({ request } as ActionFunctionArgs))) {
    return redirect("/");
  }
  const transactionId = params.transactionId;
  if (!transactionId) {
    return redirect("/transactions");
  }
  await deleteTransaction({
    request,
    transactionId,
  } as ActionFunctionArgs & { transactionId: string });
  return redirect("/transactions");
}
