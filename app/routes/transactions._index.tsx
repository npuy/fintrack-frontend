import { Container, Space, Title } from "@mantine/core";
import { ActionFunctionArgs, redirect } from "@remix-run/node";
import FiltersTransaction from "~/components/Transaction/FiltersTransaction";
import TableTransactions from "~/components/Transaction/TableTransaction";
import { getAccounts } from "~/services/account/account";
import { userLoggedIn } from "~/services/authentication/middleware";
import { getCategories } from "~/services/category/category";
import { getCurrencies } from "~/services/currency/currency";
import {
  getQueryParamsFromFormData,
  getTransactionsFull,
} from "~/services/transaction/transaction";

export function meta() {
  return [{ title: "Transactions" }];
}

export async function loader({ request }: ActionFunctionArgs) {
  if (!(await userLoggedIn({ request } as ActionFunctionArgs))) {
    return redirect("/");
  }

  const accounts = await getAccounts({
    request,
  } as ActionFunctionArgs);

  const categories = await getCategories({ request } as ActionFunctionArgs);

  const typeSelectData = [
    { value: "1", label: "Income" },
    { value: "2", label: "Expense" },
  ];

  const queryParams = new URL(request.url).searchParams.toString();

  const transactions = await getTransactionsFull({
    request,
    queryParams,
  } as ActionFunctionArgs & { queryParams: string });
  const currencies = await getCurrencies({ request } as ActionFunctionArgs);
  return { transactions, currencies, accounts, categories, typeSelectData };
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const queryParams = getQueryParamsFromFormData({
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate"),
    accountId: formData.get("accountId"),
    categoryId: formData.get("categoryId"),
    type: formData.get("type"),
  });

  return redirect(`/transactions?${queryParams}`);
}

export default function Accounts() {
  return (
    <Container size="md">
      <Space h="md" />
      <Title order={1}>Transactions</Title>
      <Space h="md" />
      <FiltersTransaction />
      <TableTransactions />
    </Container>
  );
}
