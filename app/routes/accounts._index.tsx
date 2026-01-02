import {
  Button,
  Container,
  Flex,
  ScrollArea,
  Space,
  Table,
  Title,
} from "@mantine/core";
import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { IconEdit } from "@tabler/icons-react";
import { BalanceDisplay } from "~/components/Balance/BalanceDisplay";
import NewButton from "~/components/Buttons/NewButton";
import { getAccountsWithBalance } from "~/services/account/account";
import { getToken, userLoggedIn } from "~/services/authentication/middleware";

export function meta() {
  return [{ title: "Accounts" }];
}

export async function loader({ request }: ActionFunctionArgs) {
  if (!(await userLoggedIn(request))) {
    return redirect("/");
  }
  const token = await getToken(request);
  const accounts = await getAccountsWithBalance({ token });
  return { accounts };
}

export default function Accounts() {
  const data = useLoaderData<typeof loader>();
  const elements = data.accounts;
  const rows = elements.map((element) => (
    <Table.Tr key={element.name}>
      <Table.Td>
        <Button
          component="a"
          href={"/accounts/" + element.id}
          leftSection={<IconEdit size={16} />}
        >
          Edit
        </Button>
      </Table.Td>
      <Table.Td>{element.name}</Table.Td>
      <Table.Td>
        <BalanceDisplay
          balance={element.balance}
          symbol={element.currency.symbol}
        />
      </Table.Td>
      <Table.Td>{element.currency.name}</Table.Td>
    </Table.Tr>
  ));

  return (
    <Container size="md">
      <Space h="md" />
      <Title order={1}>Accounts</Title>
      <Space h="md" />
      <Flex justify="flex-end">
        <NewButton link="/accounts/new">Account</NewButton>
      </Flex>
      <Space h="md" />
      <ScrollArea>
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Edit</Table.Th>
              <Table.Th>Name</Table.Th>
              <Table.Th>Balance</Table.Th>
              <Table.Th>Currency</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </ScrollArea>
    </Container>
  );
}
