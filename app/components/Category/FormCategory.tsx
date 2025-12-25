import { Flex, Space, TextInput } from "@mantine/core";
import { Form, useActionData } from "@remix-run/react";
import { ReactNode } from "react";
import { action } from "~/routes/categories.$categoryId";

interface LoadData {
  name?: string;
}

export function FormCategory({
  children,
  loadData,
}: {
  children: ReactNode;
  loadData: LoadData;
}) {
  const actionData = useActionData<typeof action>();

  return (
    <Form method="post">
      <TextInput
        label="Name"
        name="name"
        defaultValue={actionData?.values.name ?? loadData.name}
        error={actionData?.errors.name}
      />
      <Space h="md" />
      <Flex justify="flex-end">{children}</Flex>
    </Form>
  );
}
