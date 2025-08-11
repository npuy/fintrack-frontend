import { Container, Fieldset, Space, Title } from "@mantine/core";
import { FormTransfer } from "./FormTransfer";
import CreateButton from "../Buttons/CreateButton";

export default function NewTransfer() {
  return (
    <Container size="xs">
      <Fieldset>
        <Space h="md" />
        <Title order={1}>New Transfer</Title>
        <Space h="md" />
        <FormTransfer>
          <CreateButton />
        </FormTransfer>
      </Fieldset>
    </Container>
  );
}
