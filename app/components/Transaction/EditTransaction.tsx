import {
  Container,
  Fieldset,
  Flex,
  Space,
  TextInput,
  Title,
} from "@mantine/core";
import { Form, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { loader } from "~/routes/transactions.$transactionId";
import DeleteButton from "../Buttons/DeleteButton";
import EditButton from "../Buttons/EditButton";

export default function EditTransaction() {
  const data = useLoaderData<typeof loader>();
  const [value, setValue] = useState(data.transaction.name);

  return (
    <Container size="xs">
      <Fieldset>
        <Space h="md" />
        <Title order={1}>Edit Transaction</Title>
        <Space h="md" />
        <Form method="post">
          <TextInput
            label="Name"
            name="name"
            value={value}
            onChange={(event) => setValue(event.currentTarget.value)}
            required
          />
          <Space h="md" />
          <Flex justify="flex-end">
            <DeleteButton />
            <Space w="md" />
            <EditButton />
          </Flex>
        </Form>
      </Fieldset>
    </Container>
  );
}
