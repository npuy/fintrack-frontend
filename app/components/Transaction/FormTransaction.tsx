import { Flex, NumberInput, Select, Space, TextInput } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { Form, useLoaderData } from "@remix-run/react";
import { ReactNode, useState } from "react";
import { loader } from "~/routes/transactions.$transactionId";

interface LoadData {
  description?: string;
  amount?: number;
  date: Date;
  account: string | null;
  category: string | null;
  type: string | null;
}

export function FormTransaction({
  children,
  loadData,
}: {
  children: ReactNode;
  loadData: LoadData;
}) {
  const data = useLoaderData<typeof loader>();

  const accountsSelectData = data.accounts.map((account) => ({
    value: account.id,
    label: account.name,
  }));
  const categoriesSelectData = data.categories.map((category) => ({
    value: category.id,
    label: category.name,
  }));

  const [formValues, setFormValues] = useState({
    description: loadData.description,
    amount: loadData.amount,
    date: loadData.date,
    account: loadData.account,
    category: loadData.category,
    type: loadData.type,
  });

  const [formErrors, setFormErrors] = useState({
    description: false,
    amount: false,
    date: false,
    account: false,
    category: false,
    type: false,
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
      description: !formValues.description,
      amount: !formValues.amount,
      date: !formValues.date,
      account: !formValues.account,
      category: !formValues.category,
      type: !formValues.type,
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
        label="Description"
        name="description"
        value={formValues.description}
        onChange={(event) =>
          handleChange("description", event.currentTarget.value)
        }
        error={formErrors.description ? "Description is required" : null}
      />
      <NumberInput
        label="Amount"
        name="amount"
        decimalScale={2}
        value={formValues.amount}
        onChange={(value) => handleChange("amount", value)}
        decimalSeparator=","
        thousandSeparator="."
        error={formErrors.amount ? "Amount is required" : null}
      />
      <DateInput
        label="Date"
        name="date"
        value={formValues.date}
        onChange={(value) => handleChange("date", value)}
        valueFormat="YYYY/MM/DD"
        error={formErrors.date ? "Date is required" : null}
      />
      <Select
        label="Account"
        name="account"
        data={accountsSelectData}
        value={formValues.account}
        onChange={(value) => handleChange("account", value)}
        nothingFoundMessage="Nothing found..."
        error={formErrors.account ? "Account is required" : null}
      />
      <Select
        label="Category"
        name="category"
        data={categoriesSelectData}
        value={formValues.category}
        onChange={(value) => handleChange("category", value)}
        nothingFoundMessage="Nothing found..."
        error={formErrors.category ? "Category is required" : null}
      />
      <Select
        label="Type"
        name="type"
        data={data.typeSelectData}
        value={formValues.type}
        onChange={(value) => handleChange("type", value)}
        nothingFoundMessage="Nothing found..."
        error={formErrors.type ? "Type is required" : null}
      />
      <Space h="md" />
      <Flex justify="flex-end">{children}</Flex>
    </Form>
  );
}
