import { Container, Fieldset, Space, Title } from "@mantine/core";
import { Form, useLoaderData } from "@remix-run/react";
import { loader } from "~/routes/accounts.$accountId";
import EditButton from "../Buttons/EditButton";
import DeleteButton from "../Buttons/DeleteButton";
import { FormAccount } from "./FormAccount";

export default function EditAccount() {
  const data = useLoaderData<typeof loader>();
  const loadData = {
    name: data.account.name,
    currency: String(data.account.currency.id),
  };

  return (
    <Container size="xs">
      <Fieldset>
        <Space h="md" />
        <Title order={1}>Edit Account</Title>
        <Space h="md" />
        <FormAccount loadData={loadData}>
          <DeleteButton form="delete-account-form" />
          <Space w="md" />
          <EditButton />
        </FormAccount>
        <Form id="delete-account-form" method="post" action="delete" />
      </Fieldset>
    </Container>
  );
}
