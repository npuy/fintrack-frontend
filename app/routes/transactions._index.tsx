import { Container, Space, Title } from "@mantine/core";
import { ActionFunctionArgs, redirect } from "@remix-run/node";
import FiltersTransaction from "~/components/Transaction/FiltersTransaction";
import PaginationTransaction from "~/components/Transaction/PaginationTransaction";
import TableTransactions from "~/components/Transaction/TableTransaction";
import { getAccounts } from "~/services/account/account";
import { getToken, userLoggedIn } from "~/services/authentication/middleware";
import { getCategories } from "~/services/category/category";
import { getCurrencies } from "~/services/currency/currency";
import {
  getFiltersFromUrl,
  getQueryParamsFromFormData,
  getTransactionsFull,
} from "~/services/transaction/transaction";
import { typeSelectData } from "~/types/transactionType";

export function meta() {
  return [{ title: "Transactions" }];
}

export async function loader({ request }: ActionFunctionArgs) {
  if (!(await userLoggedIn(request))) {
    return redirect("/");
  }

  const token = await getToken(request);
  const accounts = await getAccounts({ token });
  const categories = await getCategories({ token });
  const currencies = await getCurrencies({ token });

  const url = new URL(request.url);
  const filters = getFiltersFromUrl(url);

  const queryParams = url.searchParams.toString();

  try {
    const transactionResponse = await getTransactionsFull({
      token,
      queryParams,
    });
    return {
      transactions: transactionResponse.data,
      currencies,
      accounts,
      categories,
      typeSelectData,
      filters,
      pagination: {
        offset: filters.offset || 0,
        limit: filters.limit || 20,
        total: transactionResponse.total,
      },
    };
  } catch (error) {
    console.error(error);
    return redirect("/transactions");
  }
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
      <PaginationTransaction />
    </Container>
  );
}
