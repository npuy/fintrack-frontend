import { Flex, NumberInput, Select, Space, TextInput } from "@mantine/core";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { ReactNode } from "react";
import { action, loader } from "~/routes/transactions.$transactionId";
import { ClientDateInput } from "./ClientDateInput";

interface LoadData {
  description?: string;
  amount?: number;
  date?: string;
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
      <ClientDateInput
        date={loadData.date}
        submittedDate={actionData?.values.date}
        error={actionData?.errors.date}
      />
      <Select
        searchable
        label="Account"
        name="account"
        data={accountsSelectData}
        nothingFoundMessage="Nothing found..."
        defaultValue={actionData?.values.account ?? loadData.account}
        error={actionData?.errors.account}
      />
      <Select
        searchable
        label="Category"
        name="category"
        data={categoriesSelectData}
        nothingFoundMessage="Nothing found..."
        defaultValue={actionData?.values.category ?? loadData.category}
        error={actionData?.errors.category}
      />
      <Select
        searchable
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
