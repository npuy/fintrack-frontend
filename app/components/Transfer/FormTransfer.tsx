import { Flex, NumberInput, Select, Space, TextInput } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { ReactNode, useState } from "react";
import { action, loader } from "~/routes/transfer";
import { toDateValue } from "~/utils/forms";

export function FormTransfer({ children }: { children: ReactNode }) {
  const data = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  const accountsSelectData = data.accounts.map((account) => ({
    value: account.id,
    label: account.name,
  }));
  const categoriesSelectData = data.categories.map((category) => ({
    value: category.id,
    label: category.name,
  }));

  const [formValues, setFormValues] = useState({
    amount: actionData?.values.amount || "",
    amountFrom: actionData?.values.amountFrom || "",
    amountTo: actionData?.values.amountTo || "",
    accountFrom: actionData?.values.accountFrom || "",
    accountTo: actionData?.values.accountTo || "",
  });

  const [formErrors, setFormErrors] = useState({
    amount: actionData?.errors.amount || "",
    amountFrom: actionData?.errors.amountFrom || "",
    amountTo: actionData?.errors.amountTo || "",
    accountFrom: actionData?.errors.accountFrom || "",
    accountTo: actionData?.errors.accountTo || "",
  });

  const [differentCurrencies, setDifferentCurrencies] = useState(false);

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
        if (accountFrom.id === accountTo.id) {
          setFormErrors((errors) => ({
            ...errors,
            accountFrom: "Account from and to cannot be the same",
            accountTo: "Account from and to cannot be the same",
          }));
        } else {
          setFormErrors((errors) => ({
            ...errors,
            accountFrom: "",
            accountTo: "",
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
        } else {
          setDifferentCurrencies(false);
        }
      }
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission

    const errors = {
      ...formErrors,
      amount:
        !formValues.amount && !differentCurrencies
          ? "Amount is required"
          : formErrors.amount,
      amountFrom:
        !formValues.amountFrom && differentCurrencies
          ? "Amount from is required"
          : formErrors.amountFrom,
      amountTo:
        !formValues.amountTo && differentCurrencies
          ? "Amount to is required"
          : formErrors.amountTo,
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
      <Select
        searchable
        label="Account from"
        name="accountFrom"
        data={accountsSelectData}
        value={formValues.accountFrom}
        onChange={(value) => handleChange("accountFrom", value)}
        nothingFoundMessage="Nothing found..."
        error={formErrors.accountFrom ? formErrors.accountFrom : null}
      />
      <Select
        searchable
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
        defaultValue={actionData?.values.description}
        error={actionData?.errors.description}
      />
      {differentCurrencies ? (
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
        valueFormat="YYYY/MM/DD"
        defaultValue={toDateValue(actionData?.values.date) ?? new Date()}
      />
      <Select
        searchable
        label="Category"
        name="category"
        data={categoriesSelectData}
        nothingFoundMessage="Nothing found..."
        defaultValue={actionData?.values.category}
        error={actionData?.errors.category}
      />
      <Space h="md" />
      <Flex justify="flex-end">{children}</Flex>
    </Form>
  );
}
