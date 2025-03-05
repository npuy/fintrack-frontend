import {
  Box,
  Group,
  Paper,
  Progress,
  SimpleGrid,
  Text,
  Title,
} from "@mantine/core";
import classes from "./StatsSegments.module.css";
import { loader } from "~/routes/dashboard";
import { useLoaderData } from "@remix-run/react";
import { formatAmount } from "~/utils/amount";

interface categoriesFormatted {
  key: string;
  label: string;
  count: string;
  part: number;
  color: string;
}

const colors = [
  "red",
  "blue",
  "yellow",
  "green",
  "orange",
  "brown",
  "violet",
  "dark gray",
  "black",
];

export function StatsSegments() {
  const data = useLoaderData<typeof loader>();
  const userCurrency = data.userCurrency;
  const categories = data.categories;

  const categoriesData = categories.map((category) => ({
    id: category.id,
    name: category.name,
    balance: category.balance,
  }));

  // change balance sign for expenses
  categoriesData.forEach((category) => {
    category.balance = category.balance * -1;
  });

  // order categories by amount and discard categories with < 0 balance
  categoriesData.sort((a, b) => b.balance - a.balance);
  const categoriesFiltered = categoriesData.filter(
    (category) => category.balance > 0
  );

  // get top 8 categories and join the rest into "Other" category
  const topCategories = categoriesFiltered.slice(0, 8);

  // get total balance of all categories
  const totalBalance = categoriesFiltered.reduce(
    (acc, category) => acc + category.balance,
    0
  );

  // format data for segments
  const categoriesFormatted: categoriesFormatted[] = topCategories.map(
    (category, index) => ({
      key: category.id,
      label: category.name,
      count: formatAmount(category.balance),
      part: Math.round((category.balance / totalBalance) * 100),
      color: colors[index],
    })
  );

  // add "Other" category if there are any other categories
  if (topCategories.length == 8) {
    const otherCategories = categoriesFiltered.slice(8);
    const otherCategoriesCount = otherCategories.reduce(
      (acc, category) => acc + category.balance,
      0
    );
    categoriesFormatted.push({
      key: "other",
      label: "Other",
      count: formatAmount(otherCategoriesCount),
      part: Math.round((otherCategoriesCount / totalBalance) * 100),
      color: colors[8],
    });
  }

  if (categoriesFormatted.length === 0) {
    return (
      <Paper withBorder p="md" radius="md" w={900}>
        <Text fz="xl" fw={700}>
          No data to display, add some categories with positive balance to see
          stats.
        </Text>
      </Paper>
    );
  }

  const segments = categoriesFormatted.map((segment) => (
    <Progress.Section
      value={segment.part}
      color={segment.color}
      key={segment.color}
    >
      {segment.part > 10 && <Progress.Label>{segment.part}%</Progress.Label>}
    </Progress.Section>
  ));

  const descriptions = categoriesFormatted.map((stat) => (
    <Box
      key={stat.key}
      style={{ borderBottomColor: stat.color }}
      className={classes.stat}
    >
      <Text tt="uppercase" fz="xs" c="dimmed" fw={700}>
        {stat.label}
      </Text>

      <Group justify="space-between" align="flex-end" gap={0}>
        <Text fw={700}>{stat.count}</Text>
        <Text c={stat.color} fw={700} size="sm" className={classes.statCount}>
          {stat.part}%
        </Text>
      </Group>
    </Box>
  ));

  return (
    <>
      <Title order={1}>Total spent by category</Title>

      <Paper withBorder p="md" radius="md" w={832}>
        <Group justify="space-between">
          <Group align="flex-end" gap="xs">
            <Text fz="xl" fw={700}>
              Total: {formatAmount(totalBalance)} {userCurrency.name}
            </Text>
          </Group>
        </Group>
        <Progress.Root
          size={34}
          classNames={{ label: classes.progressLabel }}
          mt={40}
        >
          {segments}
        </Progress.Root>
        <SimpleGrid cols={{ base: 1, xs: 3 }} mt="xl">
          {descriptions}
        </SimpleGrid>
      </Paper>
    </>
  );
}
