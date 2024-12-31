import {
  Container,
  Fieldset,
  Flex,
  NumberInput,
  Select,
  Space,
  TextInput,
  Title,
} from "@mantine/core";
import { Form, useLoaderData } from "@remix-run/react";
import CreateButton from "../Buttons/CreateButton";
import { DateInput } from "@mantine/dates";
import { loader } from "~/routes/transactions.$transactionId";
import { useState } from "react";

export default function NewTransaction() {
  const data = useLoaderData<typeof loader>();
  const [accountId, setAccountId] = useState<string | null>(null);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [type, setType] = useState<string | null>(null);
  const accountsSelectData = data.accounts.map((account) => ({
    value: account.id,
    label: account.name,
  }));
  const categoriesSelectData = data.categories.map((category) => ({
    value: category.id,
    label: category.name,
  }));

  return (
    <Container size="xs">
      <Fieldset>
        <Space h="md" />
        <Title order={1}>New Transaction</Title>
        <Space h="md" />
        <Form method="post">
          {" "}
          <TextInput label="Description" name="description" required />
          <NumberInput label="Amount" name="amount" decimalScale={2} required />
          <DateInput
            label="Date"
            name="date"
            valueFormat="YYYY/MM/DD"
            required
          />
          <Select
            label="Account"
            name="account"
            data={accountsSelectData}
            value={accountId}
            onChange={(value) => setAccountId(value)}
            required
            nothingFoundMessage="Nothing found..."
          />
          <Select
            label="Category"
            name="category"
            data={categoriesSelectData}
            value={categoryId}
            onChange={(value) => setCategoryId(value)}
            required
            nothingFoundMessage="Nothing found..."
          />
          <Select
            label="Type"
            name="type"
            data={data.typeSelectData}
            value={type}
            onChange={(value) => setType(value)}
            required
            nothingFoundMessage="Nothing found..."
          />
          <Space h="md" />
          <Flex justify="flex-end">
            <CreateButton />
          </Flex>
        </Form>
      </Fieldset>
    </Container>
  );
}
