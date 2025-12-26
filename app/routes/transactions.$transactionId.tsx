import { useLoaderData } from "@remix-run/react";
import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { getToken, userLoggedIn } from "~/services/authentication/middleware";
import NewTransaction from "~/components/Transaction/NewTransaction";
import EditTransaction from "~/components/Transaction/EditTransaction";
import { getAccounts } from "~/services/account/account";
import {
  createTransaction,
  getTransaction,
  updateTransaction,
  validateTransactionData,
} from "~/services/transaction/transaction";
import {
  TransactionCreate,
  Transaction as TransactionType,
} from "~/types/transaction";
import { getCategories } from "~/services/category/category";
import { typeSelectData } from "~/types/transactionType";

export function meta() {
  return [{ title: "Transaction" }];
}

export async function action({ request, params }: ActionFunctionArgs) {
  if (!(await userLoggedIn(request))) {
    return redirect("/");
  }
  const formData = await request.formData();
  const transactionId = params.transactionId;
  if (!transactionId) {
    return redirect("/transactions");
  }

  const result = validateTransactionData(formData);

  if (!result.success) {
    return {
      errors: result.errors,
      values: result.values,
    };
  }
  const transactionData: TransactionCreate = {
    ...result.data,
    accountId: result.data.account,
    categoryId: result.data.category,
  };

  const token = await getToken(request);
  if (transactionId == "new") {
    await createTransaction({
      token,
      transactionData,
    });
  } else {
    transactionData.id = transactionId;
    await updateTransaction({
      token,
      transactionData,
    });
  }
  return redirect("/transactions");
}

export async function loader({ request, params }: ActionFunctionArgs) {
  const transactionId = params.transactionId;
  if (!(await userLoggedIn(request)) || !transactionId) {
    return redirect("/");
  }

  const token = await getToken(request);
  const accounts = await getAccounts({
    token,
  });

  const categories = await getCategories({ token });

  let transaction: TransactionType = {
    id: "new",
    amount: 0,
    description: "",
    date: new Date("2000-01-01T00:00:00"),
    accountId: "",
    categoryId: "",
    type: 1,
    createdAt: new Date("2000-01-01T00:00:00"),
    updatedAt: new Date("2000-01-01T00:00:00"),
  };
  if (transactionId != "new") {
    transaction = await getTransaction({
      token,
      transactionId,
    });
  }
  return {
    transaction,
    accounts,
    categories,
    typeSelectData,
  };
}

export default function Transaction() {
  const data = useLoaderData<typeof loader>();

  if (data.transaction.id == "new") {
    return <NewTransaction />;
  }

  return <EditTransaction />;
}
