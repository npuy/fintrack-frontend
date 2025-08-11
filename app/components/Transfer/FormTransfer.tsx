import { Flex, NumberInput, Select, Space, TextInput } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { Form, useLoaderData } from "@remix-run/react";
import { ReactNode, useState } from "react";
import { loader } from "~/routes/transfer";

export function FormTransfer({ children }: { children: ReactNode }) {
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
    description: "",
    amount: "",
    amountFrom: "",
    amountTo: "",
    date: new Date(),
    accountFrom: "",
    accountTo: "",
    category: "",
  });

  const [formErrors, setFormErrors] = useState({
    description: "",
    amount: "",
    amountFrom: "",
    amountTo: "",
    date: "",
    accountFrom: "",
    accountTo: "",
    category: "",
  });

  const [diffrentCurrencies, setDifferentCurrencies] = useState(false);

  const [currencies, setCurrencies] = useState({
    accountFrom: "",
    accountTo: "",
  });

  const handleChange = (
    field: string,
    value: string | null | Date | number
  ) => {
    setFormValues((values) => ({ ...values, [field]: value }));
    setFormErrors((errors) => ({ ...errors, [field]: "" }));

    // Handle account selection changes
    if (field === "accountFrom" || field === "accountTo") {
      const accountFrom = data.accounts.find(
        (account) =>
          account.id ===
          (field === "accountFrom" ? value : formValues.accountFrom)
      );
      const accountTo = data.accounts.find(
        (account) =>
          account.id === (field === "accountTo" ? value : formValues.accountTo)
      );

      if (accountFrom && accountTo) {
        setDifferentCurrencies(false);
        setFormErrors((errors) => ({
          ...errors,
          accountFrom: "",
          accountTo: "",
        }));
        if (accountFrom.id === accountTo.id) {
          setFormErrors((errors) => ({
            ...errors,
            accountFrom: "Account from and to cannot be the same",
            accountTo: "Account from and to cannot be the same",
          }));
        }
        if (accountFrom.currency.id !== accountTo.currency.id) {
          setDifferentCurrencies(true);
          setCurrencies({
            accountFrom: accountFrom.currency.name,
            accountTo: accountTo.currency.name,
          });
          setFormValues((values) => ({
            ...values,
            amount: "",
          }));
        }
      }
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission

    // Validate not empty fields
    const errors = {
      description: !formValues.description
        ? "Description is required"
        : formErrors.description,
      amount:
        !formValues.amount && !diffrentCurrencies
          ? "Amount is required"
          : formErrors.amount,
      amountFrom:
        !formValues.amountFrom && diffrentCurrencies
          ? "Amount from is required"
          : formErrors.amountFrom,
      amountTo:
        !formValues.amountTo && diffrentCurrencies
          ? "Amount to is required"
          : formErrors.amountTo,
      date: !formValues.date ? "Date is required" : formErrors.date,
      accountFrom: !formValues.accountFrom
        ? "Account from is required"
        : formErrors.accountFrom,
      accountTo: !formValues.accountTo
        ? "Account to is required"
        : formErrors.accountTo,
      category: !formValues.category
        ? "Category is required"
        : formErrors.category,
    };

    setFormErrors(errors);

    console.log("Form Errors:", errors);

    const hasErrors = Object.values(errors).some((error) => error);
    if (!hasErrors) {
      // Programmatically submit the form if no errors
      event.currentTarget.submit();
    }
  };

  return (
    <Form method="post" onSubmit={handleSubmit}>
      <Select
        label="Account from"
        name="accountFrom"
        data={accountsSelectData}
        value={formValues.accountFrom}
        onChange={(value) => handleChange("accountFrom", value)}
        nothingFoundMessage="Nothing found..."
        error={formErrors.accountFrom ? formErrors.accountFrom : null}
      />
      <Select
        label="Account to"
        name="accountTo"
        data={accountsSelectData}
        value={formValues.accountTo}
        onChange={(value) => handleChange("accountTo", value)}
        nothingFoundMessage="Nothing found..."
        error={formErrors.accountTo ? formErrors.accountTo : null}
      />
      <TextInput
        label="Description"
        name="description"
        value={formValues.description}
        onChange={(event) =>
          handleChange("description", event.currentTarget.value)
        }
        error={formErrors.description ? formErrors.description : null}
      />
      {diffrentCurrencies ? (
        <>
          <NumberInput
            label={"Amount From" + ` (${currencies.accountFrom})`}
            name="amountFrom"
            decimalScale={2}
            value={formValues.amountFrom}
            onChange={(value) => handleChange("amountFrom", value)}
            decimalSeparator=","
            thousandSeparator="."
            error={formErrors.amountFrom ? formErrors.amountFrom : null}
          />
          <NumberInput
            label={"Amount To" + ` (${currencies.accountTo})`}
            name="amountTo"
            decimalScale={2}
            value={formValues.amountTo}
            onChange={(value) => handleChange("amountTo", value)}
            decimalSeparator=","
            thousandSeparator="."
            error={formErrors.amountTo ? formErrors.amountTo : null}
          />
        </>
      ) : (
        <NumberInput
          label="Amount"
          name="amount"
          decimalScale={2}
          value={formValues.amount}
          onChange={(value) => handleChange("amount", value)}
          decimalSeparator=","
          thousandSeparator="."
          error={formErrors.amount ? formErrors.amount : null}
        />
      )}
      <DateInput
        label="Date"
        name="date"
        value={formValues.date}
        onChange={(value) => handleChange("date", value)}
        valueFormat="YYYY/MM/DD"
        error={formErrors.date ? formErrors.date : null}
      />
      <Select
        label="Category"
        name="category"
        data={categoriesSelectData}
        value={formValues.category}
        onChange={(value) => handleChange("category", value)}
        nothingFoundMessage="Nothing found..."
        error={formErrors.category ? formErrors.category : null}
      />
      <Space h="md" />
      <Flex justify="flex-end">{children}</Flex>
    </Form>
  );
}
