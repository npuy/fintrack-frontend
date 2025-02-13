import { Accordion, Button, Group, Select, Space } from "@mantine/core";
import { Form, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import NewButton from "../Buttons/NewButton";
import { DateInput } from "@mantine/dates";
import { loader } from "~/routes/transactions._index";

export default function FiltersTransaction() {
  const data = useLoaderData<typeof loader>();

  const [accountId, setAccountId] = useState<string | null>(
    data.filters.accountId || null
  );
  const [categoryId, setCategoryId] = useState<string | null>(
    data.filters.categoryId || null
  );
  const [type, setType] = useState<string | null>(
    data.filters.type ? String(data.filters.type) : null
  );
  const [startDate, setStartDate] = useState<Date | null>(
    data.filters.startDate ? new Date(data.filters.startDate) : null
  );
  const [endDate, setEndDate] = useState<Date | null>(
    data.filters.endDate ? new Date(data.filters.endDate) : null
  );
  const accountsSelectData = data.accounts.map((account) => ({
    value: account.id,
    label: account.name,
  }));
  const categoriesSelectData = data.categories.map((category) => ({
    value: category.id,
    label: category.name,
  }));

  return (
    <Accordion chevronPosition="left" variant="filled">
      <Accordion.Item value="filter">
        <Group justify="space-between">
          <Accordion.Control h={37} w={120}>
            Filter
          </Accordion.Control>
          <NewButton link="/transactions/new">Transaction</NewButton>
        </Group>
        <Accordion.Panel>
          <Form method="post">
            <Group gap="md">
              <DateInput
                value={startDate}
                onChange={(date) => setStartDate(date)}
                w={204}
                label="Date from"
                name="startDate"
                valueFormat="YYYY/MM/DD"
                clearable
              />
              <DateInput
                value={endDate}
                onChange={(date) => setEndDate(date)}
                w={204}
                label="Date to"
                name="endDate"
                valueFormat="YYYY/MM/DD"
                clearable
              />
            </Group>
            <Group gap="md">
              <Select
                label="Account"
                name="accountId"
                data={accountsSelectData}
                value={accountId}
                onChange={(value) => setAccountId(value)}
                clearable
              />
              <Select
                label="Category"
                name="categoryId"
                data={categoriesSelectData}
                value={categoryId}
                onChange={(value) => setCategoryId(value)}
                clearable
              />
              <Select
                label="Type"
                name="type"
                data={data.typeSelectData}
                value={type}
                onChange={(value) => setType(value)}
                clearable
              />
            </Group>
            <Space h="md" />
            <Button type="submit">Apply</Button>
          </Form>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
}
