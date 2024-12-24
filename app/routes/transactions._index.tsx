import { Button, Container, Flex, Space, Table, Title } from "@mantine/core";
import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { IconEdit } from "@tabler/icons-react";
import NewButton from "~/components/Buttons/NewButton";
import { userLoggedIn } from "~/services/authentication/middleware";

export function meta() {
  return [{ title: "Transactions" }];
}

const elements = [
  { description: "Comida", id: "1", amount: 1000, type: false },
  { description: "Sueldo", id: "2", amount: 1000, type: true },
  { description: "Nafta", id: "3", amount: 1000, type: false },
];

export async function loader({ request }: ActionFunctionArgs) {
  if (!(await userLoggedIn({ request } as ActionFunctionArgs))) {
    return redirect("/");
  }
  return {};
}

export default function Accounts() {
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
            <Table.Th>Description</Table.Th>
            <Table.Th>Amount</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Container>
  );
}
