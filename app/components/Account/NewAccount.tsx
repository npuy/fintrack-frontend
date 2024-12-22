import {
  Button,
  Container,
  Fieldset,
  Flex,
  Space,
  TextInput,
  Title,
} from "@mantine/core";
import { Form } from "@remix-run/react";
import { IconPlus } from "@tabler/icons-react";

export default function NewAccount() {
  return (
    <Container size="xs">
      <Fieldset>
        <Space h="md" />
        <Title order={1}>New Account</Title>
        <Space h="md" />
        <Form method="post">
          <TextInput label="Name" name="name" required />
          <Space h="md" />
          <Flex justify="flex-end">
            <Button
              variant="filled"
              leftSection={<IconPlus size={16} />}
              type="submit"
            >
              Create
            </Button>
          </Flex>
        </Form>
      </Fieldset>
    </Container>
  );
}
