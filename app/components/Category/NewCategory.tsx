import { Container, Fieldset, Space, Title } from "@mantine/core";
import CreateButton from "../Buttons/CreateButton";
import { FormCategory } from "./FormCategory";

export default function NewCategory() {
  return (
    <Container size="xs">
      <Fieldset>
        <Space h="md" />
        <Title order={1}>New Category</Title>
        <Space h="md" />
        <FormCategory loadData={{}}>
          <CreateButton />
        </FormCategory>
      </Fieldset>
    </Container>
  );
}
