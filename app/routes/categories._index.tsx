import { Button, Container, Flex, Space, Table, Title } from "@mantine/core";
import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { IconEdit } from "@tabler/icons-react";
import NewButton from "~/components/Buttons/NewButton";
import { userLoggedIn } from "~/services/authentication/middleware";

export function meta() {
  return [{ title: "Categories" }];
}

const elements = [
  { name: "Comida", id: "1", balance: 1000 },
  { name: "Gastos for fun", id: "2", balance: 1000 },
  { name: "Nafta", id: "3", balance: 1000 },
];

export async function loader({ request }: ActionFunctionArgs) {
  if (!(await userLoggedIn({ request } as ActionFunctionArgs))) {
    return redirect("/");
  }
  return {};
}

export default function Accounts() {
  const rows = elements.map((element) => (
    <Table.Tr key={element.name}>
      <Table.Td>
        <Button
          component="a"
          href={"/categories/" + element.id}
          leftSection={<IconEdit size={16} />}
        >
          Edit
        </Button>
      </Table.Td>
      <Table.Td>{element.name}</Table.Td>
      <Table.Td>{element.balance}</Table.Td>
    </Table.Tr>
  ));

  return (
    <Container size="md">
      <Space h="md" />
      <Title order={1}>Categories</Title>
      <Space h="md" />
      <Flex justify="flex-end">
        <NewButton link="/categories/new">Category</NewButton>
      </Flex>
      <Space h="md" />
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Edit</Table.Th>
            <Table.Th>Name</Table.Th>
            <Table.Th>Balance</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Container>
  );
}
