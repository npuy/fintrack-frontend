import {
  Button,
  Flex,
  NumberInput,
  Select,
  Space,
  TextInput,
} from "@mantine/core";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { action, loader } from "~/routes/settings";

interface LoadData {
  name: string;
  email: string;
  currency: string;
  payDay: number;
}

export function FormSettings({ loadData }: { loadData: LoadData }) {
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
        type="text"
        defaultValue={actionData?.values.name ?? loadData.name}
        error={actionData?.errors.name}
      />
      <TextInput
        label="Email"
        name="email"
        type="email"
        defaultValue={actionData?.values.email ?? loadData.email}
        error={actionData?.errors.email}
      />
      <Select
        label="Display currency"
        name="currency"
        description="Currency used to display amounts"
        data={currenciesSelectData}
        nothingFoundMessage="Nothing found..."
        defaultValue={actionData?.values.currency ?? loadData.currency}
        error={actionData?.errors.currency}
      />
      <NumberInput
        label="Pay day"
        name="payDay"
        description="Day of the month when you receive your salary"
        min={1}
        max={31}
        defaultValue={
          actionData?.values.payDay ? actionData.values.payDay : loadData.payDay
        }
        error={actionData?.errors.payDay}
      />
      <Space h="md" />
      <Flex justify="flex-end">
        <Button variant="filled" type="submit">
          Update
        </Button>
      </Flex>
    </Form>
  );
}
