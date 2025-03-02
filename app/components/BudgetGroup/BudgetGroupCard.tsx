import { Card, Progress, Text } from "@mantine/core";
import { BudgetGroupCardDropdown } from "./BudgetGroupCardDropdown";

interface BudgetGroupCardProps {
  id: string;
  name: string;
  limit: number;
  spent: number;
  currencySymbol: string;
}

function formatAmount(amount: number) {
  return new Intl.NumberFormat("DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function BudgetGroupCard({
  id,
  name,
  limit,
  spent,
  currencySymbol,
}: BudgetGroupCardProps) {
  const progress = (spent / limit) * 100;

  return (
    <Card
      withBorder
      radius="md"
      padding="xl"
      bg="var(--mantine-color-body)"
      style={{
        position: "relative",
      }}
      w={400}
    >
      <BudgetGroupCardDropdown budgetId={id} />
      <Text fz="xs" tt="uppercase" fw={700} c="dimmed">
        {name}
      </Text>
      <Text fz="lg" fw={500}>
        {currencySymbol + " "}
        {formatAmount(spent)} / {currencySymbol + " "}
        {formatAmount(limit)}
      </Text>
      <Progress
        value={progress}
        mt="md"
        size="lg"
        radius="xl"
        color={progress > 100 ? "red" : "blue"}
      />
    </Card>
  );
}
