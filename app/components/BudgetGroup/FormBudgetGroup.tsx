import {
  Flex,
  MultiSelect,
  NumberInput,
  Select,
  Space,
  TextInput,
} from "@mantine/core";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { ReactNode } from "react";
import { action, loader } from "~/routes/budget.$budgetId";
import { toMultiValue } from "~/utils/forms";

interface LoadData {
  name?: string;
  limit?: number;
  currency?: string;
  categories?: string[];
}

export function FormBudgetGroup({
  children,
  loadData,
}: {
  children: ReactNode;
  loadData: LoadData;
}) {
  const data = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  const currenciesSelectData = data.currencies.map((currency) => ({
    value: String(currency.id),
    label: currency.name,
  }));
  const categoriesSelectData = data.categories.map((category) => ({
    value: category.id,
    label: category.name,
  }));

  return (
    <Form method="post">
      <TextInput
        label="Name"
        name="name"
        defaultValue={actionData?.values.name ?? loadData.name}
        error={actionData?.errors.name}
      />
      <NumberInput
        label="Limit"
        name="limit"
        description="Maximum amount allowed to spend"
        decimalScale={2}
        decimalSeparator=","
        thousandSeparator="."
        defaultValue={actionData?.values.limit ?? loadData.limit}
        error={actionData?.errors.limit}
      />
      <Select
        label="Display currency"
        name="currency"
        data={currenciesSelectData}
        nothingFoundMessage="Nothing found..."
        defaultValue={actionData?.values.currency ?? loadData.currency}
        error={actionData?.errors.currency}
      />
      <MultiSelect
        label="Categories"
        name="categories"
        data={categoriesSelectData}
        nothingFoundMessage="Nothing found..."
        defaultValue={
          toMultiValue(actionData?.values.categories) ?? loadData.categories
        }
        error={actionData?.errors.categories}
      />
      <Space h="md" />
      <Flex justify="flex-end">{children}</Flex>
    </Form>
  );
}
