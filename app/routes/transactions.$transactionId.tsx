import { useLoaderData } from "@remix-run/react";
import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { userLoggedIn } from "~/services/authentication/middleware";
import NewTransaction from "~/components/Transaction/NewTransaction";
import EditTransaction from "~/components/Transaction/EditTransaction";

export function meta() {
  return [{ title: "Transaction" }];
}

export async function loader({ request, params }: ActionFunctionArgs) {
  if (!(await userLoggedIn({ request } as ActionFunctionArgs))) {
    return redirect("/");
  }
  const transactionId = params.transactionId;
  let transaction = { name: "", id: "new", balance: 0 };
  if (transactionId != "new") {
    transaction = { name: "Comida", id: "1", balance: 1000 };
  }
  return {
    transaction,
  };
}

export default function Transaction() {
  const data = useLoaderData<typeof loader>();

  if (data.transaction.id == "new") {
    return <NewTransaction />;
  }

  return <EditTransaction />;
}
