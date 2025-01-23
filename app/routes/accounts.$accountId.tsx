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
import { getCurrencies } from "~/services/currency/currency";
import { Account as AccountType } from "~/types/account";

export function meta() {
  return [{ title: "Account" }];
}

export async function loader({ request, params }: ActionFunctionArgs) {
  if (!(await userLoggedIn({ request } as ActionFunctionArgs))) {
    return redirect("/");
  }
  const accountId = params.accountId;
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
  const currencies = await getCurrencies({ request } as ActionFunctionArgs);
  if (accountId != "new") {
    account = await getAccount({ request, accountId } as ActionFunctionArgs & {
      accountId: string;
    });
  }
  return {
    account,
    currencies,
  };
}

export async function action({ request, params }: ActionFunctionArgs) {
  if (!(await userLoggedIn({ request } as ActionFunctionArgs))) {
    return redirect("/");
  }
  const accountId = params.accountId;
  const formData = await request.formData();
  const { name, currencyId } = validateAccountData(
    formData.get("name"),
    formData.get("currency")
  );
  if (accountId == "new") {
    // create account
    await createAccount({ request, name, currencyId } as ActionFunctionArgs & {
      name: string;
      currencyId: number;
    });
  } else {
    // edit account
    await editAccount({
      request,
      name,
      accountId,
      currencyId,
    } as ActionFunctionArgs & {
      name: string;
      accountId: string;
      currencyId: number;
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
