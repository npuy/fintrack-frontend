import { Container, Fieldset, Space, Title } from "@mantine/core";
import { Form, useLoaderData } from "@remix-run/react";
import { loader } from "~/routes/categories.$categoryId";
import DeleteButton from "../Buttons/DeleteButton";
import EditButton from "../Buttons/EditButton";
import { FormCategory } from "./FormCategory";

export default function EditCategory() {
  const data = useLoaderData<typeof loader>();
  const loadData = {
    name: data.category.name,
  };

  return (
    <Container size="xs">
      <Fieldset>
        <Space h="md" />
        <Title order={1}>Edit Category</Title>
        <Space h="md" />
        <FormCategory loadData={loadData}>
          <DeleteButton form="delete-category-form" />
          <Space w="md" />
          <EditButton />
        </FormCategory>
        <Form id="delete-category-form" method="post" action="delete" />
      </Fieldset>
    </Container>
  );
}
