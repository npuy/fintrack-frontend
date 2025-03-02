import { Container, Flex, Group, Space, Title } from "@mantine/core";
import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { BudgetGroupCard } from "~/components/BudgetGroup/BudgetGroupCard";
import NewButton from "~/components/Buttons/NewButton";
import { getToken, userLoggedIn } from "~/services/authentication/middleware";
import { getBudgetGroups } from "~/services/budget/budget";
import { getCurrencies } from "~/services/currency/currency";

export async function loader({ request }: ActionFunctionArgs) {
  const token = await getToken({ request } as ActionFunctionArgs);
  if (!(await userLoggedIn({ request } as ActionFunctionArgs)) || !token) {
    return redirect("/");
  }

  const budgetGroups = await getBudgetGroups({ token });
  const currencies = await getCurrencies({ request } as ActionFunctionArgs);

  return { budgetGroups, currencies };
}

export default function Dashboard() {
  const data = useLoaderData<typeof loader>();

  const budgetGroups = data.budgetGroups;
  const currencies = data.currencies;
  const currenciesDict = Object.fromEntries(
    currencies.map(({ id, ...rest }) => [id, rest])
  );

  const budgetCards = budgetGroups.map((budgetGroup) => (
    <BudgetGroupCard
      key={budgetGroup.id}
      id={budgetGroup.id}
      name={budgetGroup.name}
      limit={budgetGroup.limit}
      spent={budgetGroup.amount}
      currencySymbol={currenciesDict[budgetGroup.currencyId].symbol}
    />
  ));

  return (
    <Container size="md">
      <Space h="md" />
      <Title order={1}>Budget Groups</Title>

      <Flex justify="flex-end">
        <NewButton link="/budget/new">Budget Group</NewButton>
      </Flex>
      <Space h="md" />
      <Group justify="center" gap="xl">
        {budgetCards}
      </Group>
    </Container>
  );
}
