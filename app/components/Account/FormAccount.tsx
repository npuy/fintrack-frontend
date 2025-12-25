import { Flex, Select, Space, TextInput } from "@mantine/core";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { ReactNode } from "react";
import { action, loader } from "~/routes/accounts.$accountId";

interface LoadData {
  name?: string;
  currency: string | null;
}

export function FormAccount({
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

  return (
    <Form method="post">
      <TextInput
        label="Name"
        name="name"
        defaultValue={actionData?.values.name ?? loadData.name}
        error={actionData?.errors.name}
      />
      <Select
        label="Currency"
        name="currency"
        data={currenciesSelectData}
        defaultValue={actionData?.values.currency ?? loadData.currency}
        nothingFoundMessage="Nothing found..."
        error={actionData?.errors.currency}
      />
      <Space h="md" />
      <Flex justify="flex-end">{children}</Flex>
    </Form>
  );
}
