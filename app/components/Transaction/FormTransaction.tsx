import { Flex, NumberInput, Select, Space, TextInput } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { ReactNode } from "react";
import { action, loader } from "~/routes/transactions.$transactionId";
import { toDateValue } from "~/utils/forms";

interface LoadData {
  description?: string;
  amount?: number;
  date: Date;
  account: string | null;
  category: string | null;
  type: string | null;
}

export function FormTransaction({
  children,
  loadData,
}: {
  children: ReactNode;
  loadData: LoadData;
}) {
  const data = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  const accountsSelectData = data.accounts.map((account) => ({
    value: account.id,
    label: account.name,
  }));
  const categoriesSelectData = data.categories.map((category) => ({
    value: category.id,
    label: category.name,
  }));

  return (
    <Form method="post">
      <TextInput
        label="Description"
        name="description"
        defaultValue={actionData?.values.description ?? loadData.description}
        error={actionData?.errors.description}
      />
      <NumberInput
        label="Amount"
        name="amount"
        decimalScale={2}
        decimalSeparator=","
        thousandSeparator="."
        defaultValue={actionData?.values.amount ?? loadData.amount}
        error={actionData?.errors.amount}
      />
      <DateInput
        label="Date"
        name="date"
        valueFormat="YYYY/MM/DD"
        defaultValue={toDateValue(actionData?.values.date) ?? loadData.date}
        error={actionData?.errors.date}
      />
      <Select
        label="Account"
        name="account"
        data={accountsSelectData}
        nothingFoundMessage="Nothing found..."
        defaultValue={actionData?.values.account ?? loadData.account}
        error={actionData?.errors.account}
      />
      <Select
        label="Category"
        name="category"
        data={categoriesSelectData}
        nothingFoundMessage="Nothing found..."
        defaultValue={actionData?.values.category ?? loadData.category}
        error={actionData?.errors.category}
      />
      <Select
        label="Type"
        name="type"
        data={data.typeSelectData}
        nothingFoundMessage="Nothing found..."
        defaultValue={actionData?.values.type ?? loadData.type}
        error={actionData?.errors.type}
      />
      <Space h="md" />
      <Flex justify="flex-end">{children}</Flex>
    </Form>
  );
}
