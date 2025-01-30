import { Button, Container, Flex, Space, Table, Title } from "@mantine/core";
import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { IconEdit } from "@tabler/icons-react";
import { BalanceDisplay } from "~/components/Balance/BalanceDisplay";
import NewButton from "~/components/Buttons/NewButton";
import { userLoggedIn } from "~/services/authentication/middleware";
import { getCurrencies } from "~/services/currency/currency";
import { getTransactionsFull } from "~/services/transaction/transaction";
import { TransactionType } from "~/types/transaction";

export function meta() {
  return [{ title: "Transactions" }];
}

export async function loader({ request }: ActionFunctionArgs) {
  if (!(await userLoggedIn({ request } as ActionFunctionArgs))) {
    return redirect("/");
  }
  const transactions = await getTransactionsFull({
    request,
  } as ActionFunctionArgs);
  const currencies = await getCurrencies({ request } as ActionFunctionArgs);
  return { transactions, currencies };
}

export default function Accounts() {
  const data = useLoaderData<typeof loader>();
  const elements = data.transactions;
  const currencies = data.currencies;
  const currenciesDict = Object.fromEntries(
    currencies.map(({ id, ...rest }) => [id, rest])
  );
  const rows = elements.map((element) => (
    <Table.Tr key={element.description}>
      <Table.Td>
        <Button
          component="a"
          href={"/transactions/" + element.id}
          leftSection={<IconEdit size={16} />}
        >
          Edit
        </Button>
      </Table.Td>
      <Table.Td>{new Date(element.date).toLocaleDateString()}</Table.Td>
      <Table.Td>{element.description}</Table.Td>
      <Table.Td>
        <BalanceDisplay
          symbol={currenciesDict[element.account.currencyId].symbol}
          balance={
            element.type == TransactionType.Income
              ? element.amount
              : -element.amount
          }
        />
      </Table.Td>
      <Table.Td>{element.account.name}</Table.Td>
      <Table.Td>{element.category.name}</Table.Td>
    </Table.Tr>
  ));

  return (
    <Container size="md">
      <Space h="md" />
      <Title order={1}>Transactions</Title>
      <Space h="md" />
      <Flex justify="flex-end">
        <NewButton link="/transactions/new">Transaction</NewButton>
      </Flex>
      <Space h="md" />
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Edit</Table.Th>
            <Table.Th>Date</Table.Th>
            <Table.Th>Description</Table.Th>
            <Table.Th>Amount</Table.Th>
            <Table.Th>Account</Table.Th>
            <Table.Th>Category</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Container>
  );
}
