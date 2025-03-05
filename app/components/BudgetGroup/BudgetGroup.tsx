import { Group, Title } from "@mantine/core";
import NewButton from "../Buttons/NewButton";
import { BudgetGroupCard } from "./BudgetGroupCard";
import { loader } from "~/routes/dashboard";
import { useLoaderData } from "@remix-run/react";

export function BudgetGroup() {
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
    <>
      <Group justify="space-between" mb={50}>
        <Title order={1}>Budget Groups</Title>
        <NewButton link="/budget/new">Budget Group</NewButton>
      </Group>
      <Group justify="center" gap="xl">
        {budgetCards}
      </Group>
    </>
  );
}
