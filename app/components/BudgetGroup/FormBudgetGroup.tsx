import {
  Flex,
  MultiSelect,
  NumberInput,
  Select,
  Space,
  TextInput,
} from "@mantine/core";
import { Form, useLoaderData } from "@remix-run/react";
import { ReactNode, useState } from "react";
import { loader } from "~/routes/budget.$budgetId";

interface LoadData {
  name?: string;
  limit?: number;
  currency?: string;
  categories?: string[];
}

export function FormBudgetGroup({
  children,
  loadData,
}: {
  children: ReactNode;
  loadData: LoadData;
}) {
  const data = useLoaderData<typeof loader>();

  const currenciesSelectData = data.currencies.map((currency) => ({
    value: String(currency.id),
    label: currency.name,
  }));
  const categoriesSelectData = data.categories.map((category) => ({
    value: category.id,
    label: category.name,
  }));

  const [formValues, setFormValues] = useState({
    name: loadData.name,
    limit: loadData.limit,
    currency: loadData.currency,
    categories: loadData.categories,
  });

  const [formErrors, setFormErrors] = useState<{
    name: string | null;
    limit: string | null;
    currency: string | null;
    categories: string | null;
  }>({
    name: null,
    limit: null,
    currency: null,
    categories: null,
  });

  const handleChange = (
    field: string,
    value: string | null | number | string[]
  ) => {
    setFormValues((values) => ({ ...values, [field]: value }));
    setFormErrors((errors) => ({ ...errors, [field]: null }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission

    const errors = {
      name: !formValues.name ? "This field is required" : null,
      limit: !formValues.limit ? "This field is required" : null,
      currency: !formValues.currency ? "This field is required" : null,
      categories: !formValues.categories ? "This field is required" : null,
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
        error={formErrors.name}
      />
      <NumberInput
        label="Limit"
        name="limit"
        description="Maximum amount allowed to spend"
        decimalScale={2}
        value={formValues.limit}
        onChange={(value) => handleChange("limit", value)}
        decimalSeparator=","
        thousandSeparator="."
        error={formErrors.limit}
      />
      <Select
        label="Display currency"
        name="currency"
        data={currenciesSelectData}
        value={formValues.currency}
        onChange={(value) => handleChange("currency", value)}
        nothingFoundMessage="Nothing found..."
        error={formErrors.currency}
      />
      <MultiSelect
        label="Categories"
        name="categories"
        data={categoriesSelectData}
        value={formValues.categories}
        onChange={(value) => handleChange("categories", value)}
        nothingFoundMessage="Nothing found..."
        error={formErrors.categories}
      />
      <Space h="md" />
      <Flex justify="flex-end">{children}</Flex>
    </Form>
  );
}
