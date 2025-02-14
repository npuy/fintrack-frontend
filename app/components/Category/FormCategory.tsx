import { Flex, Space, TextInput } from "@mantine/core";
import { Form } from "@remix-run/react";
import { ReactNode, useState } from "react";

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
  const [formValues, setFormValues] = useState({
    name: loadData.name,
  });

  const [formErrors, setFormErrors] = useState({
    name: false,
  });

  const handleChange = (
    field: string,
    value: string | null | Date | number
  ) => {
    setFormValues((values) => ({ ...values, [field]: value }));
    setFormErrors((errors) => ({ ...errors, [field]: false }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission

    const errors = {
      name: !formValues.name,
    };

    setFormErrors(errors);

    const hasErrors = Object.values(errors).some((error) => error);
    if (!hasErrors) {
      // Programmatically submit the form if no errors
      event.currentTarget.submit();
    }
  };

  return (
    <Form method="post" onSubmit={handleSubmit}>
      <TextInput
        label="Name"
        name="name"
        value={formValues.name}
        onChange={(event) => handleChange("name", event.currentTarget.value)}
        error={formErrors.name ? "This field is required" : null}
      />
      <Space h="md" />
      <Flex justify="flex-end">{children}</Flex>
    </Form>
  );
}
