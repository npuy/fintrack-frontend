import { Accordion, Button, Group, Space } from "@mantine/core";
import { Form, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import NewButton from "../Buttons/NewButton";
import { DateInput } from "@mantine/dates";
import { loader } from "~/routes/categories._index";

export default function FiltersCategory() {
  const data = useLoaderData<typeof loader>();

  const [startDate, setStartDate] = useState<Date | null>(
    data.filters.startDate ? new Date(data.filters.startDate) : null
  );
  const [endDate, setEndDate] = useState<Date | null>(
    data.filters.endDate ? new Date(data.filters.endDate) : null
  );

  return (
    <Accordion chevronPosition="left" variant="filled">
      <Accordion.Item value="filter">
        <Group justify="space-between">
          <Accordion.Control h={37} w={120}>
            Filter
          </Accordion.Control>
          <NewButton link="/categories/new">Category</NewButton>
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
            <Space h="md" />
            <Button type="submit">Apply</Button>
          </Form>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
}
