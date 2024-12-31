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
import { useState } from "react";
import { loader } from "~/routes/transactions.$transactionId";
import DeleteButton from "../Buttons/DeleteButton";
import EditButton from "../Buttons/EditButton";
import { DateInput } from "@mantine/dates";

export default function EditTransaction() {
  const data = useLoaderData<typeof loader>();
  const [description, setDescription] = useState(data.transaction.description);
  const [date, setDate] = useState<Date | null>(
    new Date(data.transaction.date)
  );
  const [accountId, setAccountId] = useState<string | null>(
    data.transaction.accountId
  );
  const [categoryId, setCategoryId] = useState<string | null>(
    data.transaction.categoryId
  );
  const [type, setType] = useState<string | null>(
    data.transaction.type.toString()
  );
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
        <Title order={1}>Edit Transaction</Title>
        <Space h="md" />
        <Form method="post">
          <TextInput
            label="Description"
            name="description"
            value={description}
            onChange={(event) => setDescription(event.currentTarget.value)}
            required
          />
          <NumberInput
            label="Amount"
            name="amount"
            decimalScale={2}
            value={data.transaction.amount}
            required
          />
          <DateInput
            label="Date"
            name="date"
            value={date}
            onChange={setDate}
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
            <Form method="post" action="delete">
              <DeleteButton />
            </Form>
            <Space w="md" />
            <EditButton />
          </Flex>
        </Form>
      </Fieldset>
    </Container>
  );
}
