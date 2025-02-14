import { Container, Fieldset, Space, Title } from "@mantine/core";
import { Form, useLoaderData } from "@remix-run/react";
import { loader } from "~/routes/transactions.$transactionId";
import DeleteButton from "../Buttons/DeleteButton";
import EditButton from "../Buttons/EditButton";
import { FormTransaction } from "./FormTransaction";

export default function EditTransaction() {
  const data = useLoaderData<typeof loader>();

  const loadData = {
    description: data.transaction.description,
    amount: data.transaction.amount,
    date: new Date(data.transaction.date),
    account: data.transaction.accountId,
    category: data.transaction.categoryId,
    type: data.transaction.type.toString(),
  };

  return (
    <Container size="xs">
      <Fieldset>
        <Space h="md" />
        <Title order={1}>Edit Transaction</Title>
        <Space h="md" />
        <FormTransaction loadData={loadData}>
          <Form method="post" action="delete">
            <DeleteButton />
          </Form>
          <Space w="md" />
          <EditButton />
        </FormTransaction>
      </Fieldset>
    </Container>
  );
}
