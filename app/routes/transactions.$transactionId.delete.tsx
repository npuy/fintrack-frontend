import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { getToken, userLoggedIn } from "~/services/authentication/middleware";
import { deleteTransaction } from "~/services/transaction/transaction";

export async function action({ request, params }: ActionFunctionArgs) {
  if (!(await userLoggedIn(request))) {
    return redirect("/");
  }
  const transactionId = params.transactionId;
  if (!transactionId) {
    return redirect("/transactions");
  }
  const token = await getToken(request);
  await deleteTransaction({
    token,
    transactionId,
  });
  return redirect("/transactions");
}
