import {
  Container,
  Fieldset,
  Flex,
  Select,
  Space,
  TextInput,
  Title,
} from "@mantine/core";
import { Form, useLoaderData } from "@remix-run/react";
import CreateButton from "../Buttons/CreateButton";
import { useState } from "react";
import { loader } from "~/routes/accounts.$accountId";

export default function NewAccount() {
  const data = useLoaderData<typeof loader>();
  const [currencyId, setCurrencyId] = useState<string | null>(null);
  const currenciesSelectData = data.currencies.map((currency) => ({
    value: String(currency.id),
    label: currency.name,
  }));

  return (
    <Container size="xs">
      <Fieldset>
        <Space h="md" />
        <Title order={1}>New Account</Title>
        <Space h="md" />
        <Form method="post">
          <TextInput label="Name" name="name" required />
          <Select
            label="Currency"
            name="currency"
            data={currenciesSelectData}
            value={currencyId}
            onChange={(value) => setCurrencyId(value)}
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
