import { Container, Fieldset, Space, Title } from "@mantine/core";
import CreateButton from "../Buttons/CreateButton";
import { FormTransaction } from "./FormTransaction";

export default function NewTransaction() {
  const loadData = {
    date: new Date(),
    account: null,
    category: null,
    type: null,
  };

  return (
    <Container size="xs">
      <Fieldset>
        <Space h="md" />
        <Title order={1}>New Transaction</Title>
        <Space h="md" />
        <FormTransaction loadData={loadData}>
          <CreateButton />
        </FormTransaction>
      </Fieldset>
    </Container>
  );
}
