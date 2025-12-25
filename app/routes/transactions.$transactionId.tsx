import { useLoaderData } from "@remix-run/react";
import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { userLoggedIn } from "~/services/authentication/middleware";
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
  if (!(await userLoggedIn({ request } as ActionFunctionArgs))) {
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

  if (transactionId == "new") {
    await createTransaction({
      request,
      transactionData,
    } as ActionFunctionArgs & { transactionData: TransactionCreate });
  } else {
    transactionData.id = transactionId;
    await updateTransaction({
      request,
      transactionData,
    } as ActionFunctionArgs & { transactionId: string; transactionData: TransactionCreate });
  }
  return redirect("/transactions");
}

export async function loader({ request, params }: ActionFunctionArgs) {
  if (!(await userLoggedIn({ request } as ActionFunctionArgs))) {
    return redirect("/");
  }

  const accounts = await getAccounts({
    request,
  } as ActionFunctionArgs);

  const categories = await getCategories({ request } as ActionFunctionArgs);

  const transactionId = params.transactionId;
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
      request,
      transactionId,
    } as ActionFunctionArgs & { transactionId: string });
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
