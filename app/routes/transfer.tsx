import { ActionFunctionArgs, redirect } from "@remix-run/node";
import NewTransfer from "~/components/Transfer/NewTransfer";
import { getAccounts } from "~/services/account/account";
import { getToken, userLoggedIn } from "~/services/authentication/middleware";
import { getCategories } from "~/services/category/category";
import {
  createTransaction,
  validateTransferData,
} from "~/services/transaction/transaction";
import { TransactionCreate, TransactionType } from "~/types/transaction";

export function meta() {
  return [{ title: "Transfer" }];
}

export async function action({ request }: ActionFunctionArgs) {
  if (!(await userLoggedIn(request))) {
    return redirect("/");
  }

  const formData = await request.formData();

  const result = validateTransferData(formData);

  if (!result.success) {
    return {
      errors: result.errors,
      values: result.values,
    };
  }

  let amountForm, amountTo;
  if (result.data.amount) {
    amountForm = result.data.amount;
    amountTo = result.data.amount;
  } else {
    amountForm = result.data.amountFrom;
    amountTo = result.data.amountTo;
  }

  const transactionFromData: TransactionCreate = {
    amount: amountForm!,
    description: result.data.description,
    date: result.data.date,
    accountId: result.data.accountFrom,
    categoryId: result.data.category,
    type: TransactionType.Expense,
  };

  const transactionToData: TransactionCreate = {
    amount: amountTo!,
    description: result.data.description,
    date: result.data.date,
    accountId: result.data.accountTo,
    categoryId: result.data.category,
    type: TransactionType.Income,
  };

  const token = await getToken(request);
  await createTransaction({
    token,
    transactionData: transactionFromData,
  });
  await createTransaction({
    token,
    transactionData: transactionToData,
  });
  return redirect("/transactions");
}

export async function loader({ request }: ActionFunctionArgs) {
  if (!(await userLoggedIn(request))) {
    return redirect("/");
  }

  const token = await getToken(request);
  const accounts = await getAccounts({
    token,
  });
  const categories = await getCategories({ token });

  return {
    accounts,
    categories,
  };
}

export default function Transfer() {
  return <NewTransfer />;
}
