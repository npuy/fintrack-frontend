import {
  Button,
  Container,
  ScrollArea,
  Space,
  Table,
  Title,
} from "@mantine/core";
import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { IconEdit } from "@tabler/icons-react";
import { BalanceDisplay } from "~/components/Balance/BalanceDisplay";
import FiltersCategory from "~/components/Category/FiltersCategory";
import {
  getCurrency,
  getToken,
  userLoggedIn,
} from "~/services/authentication/middleware";
import {
  getCategoriesWithBalance,
  getCategoryFiltersFromUrl,
  getQueryParamsFromFormData,
} from "~/services/category/category";

export function meta() {
  return [{ title: "Categories" }];
}

export async function loader({ request }: ActionFunctionArgs) {
  const userCurrency = await getCurrency(request);
  if (!(await userLoggedIn(request)) || !userCurrency) {
    return redirect("/");
  }

  const url = new URL(request.url);
  const filters = getCategoryFiltersFromUrl(url);

  const queryParams = url.searchParams.toString();

  const token = await getToken(request);
  const categories = await getCategoriesWithBalance({
    token,
    queryParams,
  });
  return { categories, userCurrency, filters };
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const queryParams = getQueryParamsFromFormData({
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate"),
  });

  return redirect(`/categories?${queryParams}`);
}

export default function Accounts() {
  const data = useLoaderData<typeof loader>();
  const elements = data.categories;
  const userCurrency = data.userCurrency;
  const rows = elements.map((element) => (
    <Table.Tr key={element.name}>
      <Table.Td>
        <Button
          component="a"
          href={"/categories/" + element.id}
          leftSection={<IconEdit size={16} />}
        >
          Edit
        </Button>
      </Table.Td>
      <Table.Td>{element.name}</Table.Td>
      <Table.Td>
        <BalanceDisplay
          balance={element.balance}
          symbol={userCurrency.symbol}
        />
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Container size="md">
      <Space h="md" />
      <Title order={1}>Categories</Title>
      <Space h="md" />
      <FiltersCategory />
      <ScrollArea>
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Edit</Table.Th>
              <Table.Th>Name</Table.Th>
              <Table.Th>Balance</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </ScrollArea>
    </Container>
  );
}
