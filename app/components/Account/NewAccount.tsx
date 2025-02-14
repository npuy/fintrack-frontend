import { Container, Fieldset, Space, Title } from "@mantine/core";
import CreateButton from "../Buttons/CreateButton";
import { FormAccount } from "./FormAccount";

export default function NewAccount() {
  const loadData = {
    currency: null,
  };

  return (
    <Container size="xs">
      <Fieldset>
        <Space h="md" />
        <Title order={1}>New Account</Title>
        <Space h="md" />
        <FormAccount loadData={loadData}>
          <CreateButton />
        </FormAccount>
      </Fieldset>
    </Container>
  );
}
