import { Button, ScrollArea, Table } from "@mantine/core";
import { useLoaderData } from "@remix-run/react";
import { IconEdit } from "@tabler/icons-react";
import { loader } from "~/routes/transactions._index";
import { BalanceDisplay } from "../Balance/BalanceDisplay";
import { TransactionType } from "~/types/transaction";
import { formatYYYYMMDDToDDMMYYYY } from "~/utils/dates";

export default function TableTransactions() {
  const data = useLoaderData<typeof loader>();

  const elements = data.transactions;
  const currencies = data.currencies;
  const currenciesDict = Object.fromEntries(
    currencies.map(({ id, ...rest }) => [id, rest])
  );
  const rows = elements.map((element) => (
    <Table.Tr key={element.id}>
      <Table.Td>
        <Button
          component="a"
          href={"/transactions/" + element.id}
          leftSection={<IconEdit size={16} />}
        >
          Edit
        </Button>
      </Table.Td>
      <Table.Td>{formatYYYYMMDDToDDMMYYYY(element.date)}</Table.Td>
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
    <ScrollArea>
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
    </ScrollArea>
  );
}
