import {
  Container,
  Fieldset,
  Flex,
  Space,
  TextInput,
  Title,
} from "@mantine/core";
import { Form } from "@remix-run/react";
import CreateButton from "../Buttons/CreateButton";

export default function NewTransaction() {
  return (
    <Container size="xs">
      <Fieldset>
        <Space h="md" />
        <Title order={1}>New Transaction</Title>
        <Space h="md" />
        <Form method="post">
          <TextInput label="Name" name="name" required />
          <Space h="md" />
          <Flex justify="flex-end">
            <CreateButton />
          </Flex>
        </Form>
      </Fieldset>
    </Container>
  );
}
