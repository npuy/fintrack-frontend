import { useLoaderData } from "@remix-run/react";
import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { userLoggedIn } from "~/services/authentication/middleware";
import NewAccount from "~/components/Account/NewAccount";
import EditAccount from "~/components/Account/EditAccount";
import {
  createAccount,
  editAccount,
  getAccount,
  validateAccountData,
} from "~/services/account/account";

export function meta() {
  return [{ title: "Account" }];
}

export async function loader({ request, params }: ActionFunctionArgs) {
  if (!(await userLoggedIn({ request } as ActionFunctionArgs))) {
    return redirect("/");
  }
  const accountId = params.accountId;
  let account = { name: "", id: "new" };
  if (accountId != "new") {
    account = await getAccount({ request, accountId } as ActionFunctionArgs & {
      accountId: string;
    });
  }
  return {
    account,
  };
}

export async function action({ request, params }: ActionFunctionArgs) {
  if (!(await userLoggedIn({ request } as ActionFunctionArgs))) {
    return redirect("/");
  }
  const accountId = params.accountId;
  const formData = await request.formData();
  const { name } = validateAccountData(formData.get("name"));
  if (accountId == "new") {
    // create account
    await createAccount({ request, name } as ActionFunctionArgs & {
      name: string;
    });
  } else {
    // edit account
    await editAccount({ request, name, accountId } as ActionFunctionArgs & {
      name: string;
      accountId: string;
    });
  }
  return redirect("/accounts");
}

export default function Account() {
  const data = useLoaderData<typeof loader>();

  if (data.account.id == "new") {
    return <NewAccount />;
  }

  return <EditAccount />;
}
