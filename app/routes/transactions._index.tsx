import { Button, Container, Flex, Space, Table, Title } from "@mantine/core";
import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { IconEdit } from "@tabler/icons-react";
import NewButton from "~/components/Buttons/NewButton";
import { userLoggedIn } from "~/services/authentication/middleware";
import { getTransactions } from "~/services/transaction/transaction";

export function meta() {
  return [{ title: "Transactions" }];
}

export async function loader({ request }: ActionFunctionArgs) {
  if (!(await userLoggedIn({ request } as ActionFunctionArgs))) {
    return redirect("/");
  }
  const transactions = await getTransactions({
    request,
  } as ActionFunctionArgs);
  return { transactions };
}

export default function Accounts() {
  const data = useLoaderData<typeof loader>();
  const elements = data.transactions;
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
      <Table.Td>{element.amount}</Table.Td>
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
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Container>
  );
}
