import { useLoaderData } from "@remix-run/react";
import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { userLoggedIn } from "~/services/authentication/middleware";
import NewAccount from "~/components/Account/NewAccount";
import EditAccount from "~/components/Account/EditAccount";

export function meta() {
  return [{ title: "Account" }];
}

export async function loader({ request, params }: ActionFunctionArgs) {
  if (!(await userLoggedIn({ request } as ActionFunctionArgs))) {
    return redirect("/");
  }
  const accountId = params.accountId;
  let account = { name: "", id: "new", balance: 0 };
  if (accountId != "new") {
    account = { name: "Cuenta dolares", id: "1", balance: 1000 };
  }
  return {
    account,
  };
}

export default function Account() {
  const data = useLoaderData<typeof loader>();

  if (data.account.id == "new") {
    return <NewAccount />;
  }

  return <EditAccount />;
}
