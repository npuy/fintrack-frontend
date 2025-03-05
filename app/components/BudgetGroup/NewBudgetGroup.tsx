import { Container, Fieldset, Space, Title } from "@mantine/core";
import CreateButton from "../Buttons/CreateButton";
import { FormBudgetGroup } from "./FormBudgetGroup";

export function NewBudgetGroup() {
  return (
    <Container size="xs">
      <Fieldset>
        <Space h="md" />
        <Title order={1}>New Budget Group</Title>
        <Space h="md" />
        <FormBudgetGroup loadData={{}}>
          <CreateButton />
        </FormBudgetGroup>
      </Fieldset>
    </Container>
  );
}
