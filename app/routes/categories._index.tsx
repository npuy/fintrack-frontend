import { Button, Container, Flex, Space, Table, Title } from "@mantine/core";
import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { IconEdit } from "@tabler/icons-react";
import { BalanceDisplay } from "~/components/Balance/BalanceDisplay";
import NewButton from "~/components/Buttons/NewButton";
import { userLoggedIn } from "~/services/authentication/middleware";
import { getCategoriesWithBalance } from "~/services/category/category";

export function meta() {
  return [{ title: "Categories" }];
}

export async function loader({ request }: ActionFunctionArgs) {
  if (!(await userLoggedIn({ request } as ActionFunctionArgs))) {
    return redirect("/");
  }
  const categories = await getCategoriesWithBalance({
    request,
  } as ActionFunctionArgs);
  return { categories };
}

export default function Accounts() {
  const data = useLoaderData<typeof loader>();
  const elements = data.categories;
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
      <Table.Td>
        <BalanceDisplay balance={element.balance} symbol="$" />
      </Table.Td>
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
