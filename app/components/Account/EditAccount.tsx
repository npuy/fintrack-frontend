import {
  Button,
  Container,
  Fieldset,
  Flex,
  Space,
  TextInput,
  Title,
} from "@mantine/core";
import { Form, useLoaderData } from "@remix-run/react";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { useState } from "react";
import { loader } from "~/routes/accounts.$accountId";

export default function EditAccount() {
  const data = useLoaderData<typeof loader>();
  const [value, setValue] = useState(data.account.name);

  return (
    <Container size="xs">
      <Fieldset>
        <Space h="md" />
        <Title order={1}>Edit Account</Title>
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
            <Button
              variant="default"
              leftSection={<IconTrash size={16} />}
              type="button"
            >
              Delete
            </Button>
            <Space w="md" />
            <Button
              variant="filled"
              leftSection={<IconEdit size={16} />}
              type="submit"
            >
              Edit
            </Button>
          </Flex>
        </Form>
      </Fieldset>
    </Container>
  );
}
