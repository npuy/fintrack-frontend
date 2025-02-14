import { Button, Flex, Select, Space, TextInput } from "@mantine/core";
import { Form, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { loader } from "~/routes/settings";

interface LoadData {
  name: string;
  email: string;
  currency: string;
}

export function FormSettings({ loadData }: { loadData: LoadData }) {
  const data = useLoaderData<typeof loader>();

  const currenciesSelectData = data.currencies.map((currency) => ({
    value: String(currency.id),
    label: currency.name,
  }));

  const [formValues, setFormValues] = useState({
    name: loadData.name,
    email: loadData.email,
    currency: loadData.currency,
  });

  const [formErrors, setFormErrors] = useState({
    name: false,
    email: false,
    currency: false,
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
      email: !formValues.email,
      currency: !formValues.currency,
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
        type="text"
        value={formValues.name}
        onChange={(event) => handleChange("name", event.currentTarget.value)}
        error={formErrors.name ? "This field is required" : null}
      />
      <TextInput
        label="Email"
        name="email"
        type="email"
        value={formValues.email}
        onChange={(event) => handleChange("email", event.currentTarget.value)}
        error={formErrors.email ? "This field is required" : null}
      />
      <Select
        label="Display currency"
        name="currency"
        description="Currency used to display amounts"
        data={currenciesSelectData}
        value={formValues.currency}
        onChange={(value) => handleChange("currency", value)}
        nothingFoundMessage="Nothing found..."
        error={formErrors.currency ? "This field is required" : null}
      />
      <Space h="md" />
      <Flex justify="flex-end">
        <Button variant="filled" type="submit">
          Update
        </Button>
      </Flex>
    </Form>
  );
}
