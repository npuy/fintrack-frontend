import {
  Button,
  Flex,
  NumberInput,
  Select,
  Space,
  TextInput,
} from "@mantine/core";
import { Form, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { loader } from "~/routes/settings";

interface LoadData {
  name: string;
  email: string;
  currency: string;
  payDay: number;
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
    payDay: loadData.payDay,
  });

  const [formErrors, setFormErrors] = useState<{
    name: string | null;
    email: string | null;
    currency: string | null;
    payDay: string | null;
  }>({
    name: null,
    email: null,
    currency: null,
    payDay: null,
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
      name: !formValues.name ? "This field is required" : null,
      email: !formValues.email ? "This field is required" : null,
      currency: !formValues.currency ? "This field is required" : null,
      payDay: !formValues.payDay
        ? "This field is required"
        : formValues.payDay < 1 || formValues.payDay > 31
        ? "This field should be between 1 and 31"
        : null,
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
        error={formErrors.name}
      />
      <TextInput
        label="Email"
        name="email"
        type="email"
        value={formValues.email}
        onChange={(event) => handleChange("email", event.currentTarget.value)}
        error={formErrors.email}
      />
      <Select
        label="Display currency"
        name="currency"
        description="Currency used to display amounts"
        data={currenciesSelectData}
        value={formValues.currency}
        onChange={(value) => handleChange("currency", value)}
        nothingFoundMessage="Nothing found..."
        error={formErrors.currency}
      />
      <NumberInput
        label="Pay day"
        name="payDay"
        description="Day of the month when you receive your salary"
        value={formValues.payDay}
        onChange={(value) => handleChange("payDay", value)}
        error={formErrors.payDay}
        min={1}
        max={31}
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
