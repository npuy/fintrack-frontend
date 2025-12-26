import { useLoaderData } from "@remix-run/react";
import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { getToken, userLoggedIn } from "~/services/authentication/middleware";
import NewAccount from "~/components/Account/NewAccount";
import EditAccount from "~/components/Account/EditAccount";
import {
  createAccount,
  editAccount,
  getAccount,
  validateAccountData,
} from "~/services/account/account";
import { getCurrencies } from "~/services/currency/currency";
import { Account as AccountType } from "~/types/account";

export function meta() {
  return [{ title: "Account" }];
}

export async function loader({ request, params }: ActionFunctionArgs) {
  const accountId = params.accountId;
  if (!(await userLoggedIn(request)) || !accountId) {
    return redirect("/");
  }
  let account: AccountType = {
    id: "new",
    name: "",
    userId: "",
    currencyId: 1,
    currency: {
      id: 1,
      name: "",
      symbol: "",
      multiplier: 1,
      createdAt: new Date("2000-01-01T00:00:00"),
      updatedAt: new Date("2000-01-01T00:00:00"),
    },
    createdAt: new Date("2000-01-01T00:00:00"),
    updatedAt: new Date("2000-01-01T00:00:00"),
  };
  const token = await getToken(request);
  const currencies = await getCurrencies({ token });
  if (accountId != "new") {
    account = await getAccount({ token, accountId });
  }
  return {
    account,
    currencies,
  };
}

export async function action({ request, params }: ActionFunctionArgs) {
  const accountId = params.accountId;
  if (!(await userLoggedIn(request)) || !accountId) {
    return redirect("/");
  }
  const formData = await request.formData();

  const result = validateAccountData(formData);

  if (!result.success) {
    return {
      errors: result.errors,
      values: result.values,
    };
  }
  const { name, currency: currencyId } = result.data;

  const token = await getToken(request);
  if (accountId == "new") {
    // create account
    await createAccount({ token, name, currencyId });
  } else {
    // edit account
    await editAccount({
      token,
      name,
      accountId,
      currencyId,
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
