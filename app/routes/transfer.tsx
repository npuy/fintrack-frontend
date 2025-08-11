import { ActionFunctionArgs, redirect } from "@remix-run/node";
import NewTransfer from "~/components/Transfer/NewTransfer";
import { getAccounts } from "~/services/account/account";
import { userLoggedIn } from "~/services/authentication/middleware";
import { getCategories } from "~/services/category/category";
import {
  createTransaction,
  validateTransactionData,
} from "~/services/transaction/transaction";
import { TransactionCreate } from "~/types/transaction";
import { typeSelectData } from "~/types/transactionType";

export function meta() {
  return [{ title: "Transfer" }];
}

export async function action({ request }: ActionFunctionArgs) {
  if (!(await userLoggedIn({ request } as ActionFunctionArgs))) {
    return redirect("/");
  }

  const formData = await request.formData();

  const amount = formData.get("amount");
  let amountForm, amountTo;
  if (amount) {
    amountForm = amount;
    amountTo = amount;
  } else {
    amountForm = formData.get("amountFrom");
    amountTo = formData.get("amountTo");
  }

  const transactionFromData = validateTransactionData(
    amountForm,
    formData.get("description"),
    formData.get("date"),
    formData.get("accountFrom"),
    formData.get("category"),
    typeSelectData[1].value
  );

  const transactionToData = validateTransactionData(
    amountTo,
    formData.get("description"),
    formData.get("date"),
    formData.get("accountTo"),
    formData.get("category"),
    typeSelectData[0].value
  );

  await createTransaction({
    request,
    transactionData: transactionFromData,
  } as ActionFunctionArgs & { transactionData: TransactionCreate });
  await createTransaction({
    request,
    transactionData: transactionToData,
  } as ActionFunctionArgs & { transactionData: TransactionCreate });
  return redirect("/transactions");
}

export async function loader({ request }: ActionFunctionArgs) {
  if (!(await userLoggedIn({ request } as ActionFunctionArgs))) {
    return redirect("/");
  }

  const accounts = await getAccounts({
    request,
  } as ActionFunctionArgs);

  const categories = await getCategories({ request } as ActionFunctionArgs);

  return {
    accounts,
    categories,
  };
}

export default function Transfer() {
  return <NewTransfer />;
}
