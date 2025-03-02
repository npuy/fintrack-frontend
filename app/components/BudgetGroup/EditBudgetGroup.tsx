import { Container, Fieldset, Space, Title } from "@mantine/core";
import { FormBudgetGroup } from "./FormBudgetGroup";
import DeleteButton from "../Buttons/DeleteButton";
import { Form, useLoaderData } from "@remix-run/react";
import EditButton from "../Buttons/EditButton";
import { loader } from "~/routes/budget.$budgetId";

export function EditBudgetGroup() {
  const data = useLoaderData<typeof loader>();

  const loadData = {
    name: data.budgetGroup.name,
    limit: data.budgetGroup.limit,
    currency: String(data.budgetGroup.currencyId),
    categories: data.budgetGroup.categories.map((category) => category.id),
  };

  return (
    <Container size="xs">
      <Fieldset>
        <Space h="md" />
        <Title order={1}>Edit Budget Group</Title>
        <Space h="md" />
        <FormBudgetGroup loadData={loadData}>
          <Form method="post" action="delete">
            <DeleteButton />
          </Form>
          <Space w="md" />
          <EditButton />
        </FormBudgetGroup>
      </Fieldset>
    </Container>
  );
}
