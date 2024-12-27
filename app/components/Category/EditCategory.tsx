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
import { loader } from "~/routes/categories.$categoryId";
import DeleteButton from "../Buttons/DeleteButton";
import EditButton from "../Buttons/EditButton";

export default function EditCategory() {
  const data = useLoaderData<typeof loader>();
  const [value, setValue] = useState(data.category.name);

  return (
    <Container size="xs">
      <Fieldset>
        <Space h="md" />
        <Title order={1}>Edit Category</Title>
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
            <Form method="post" action="delete">
              <DeleteButton />
            </Form>
            <Space w="md" />
            <EditButton />
          </Flex>
        </Form>
      </Fieldset>
    </Container>
  );
}
