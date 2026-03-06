import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  Alert,
  Button,
  Container,
  ScrollArea,
  Space,
  Table,
  Title,
} from "@mantine/core";
import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { IconEdit } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import { BalanceDisplay } from "~/components/Balance/BalanceDisplay";
import FiltersCategory from "~/components/Category/FiltersCategory";
import { SortableRow } from "~/components/SortableRow/SortableRow";
import { ToggleEnabled } from "~/components/Toggle/ToggleEnabled";
import {
  getCurrency,
  getToken,
  userLoggedIn,
} from "~/services/authentication/middleware";
import {
  getCategoriesWithBalance,
  getCategoryFiltersFromUrl,
  getQueryParamsFromFormData,
  reorderCategories,
  toggleCategory,
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
  const intent = formData.get("intent");

  if (intent === "toggle") {
    const token = await getToken(request);
    const categoryId = formData.get("id") as string;
    const name = formData.get("name") as string;
    const enabled = formData.get("enabled") === "true";

    try {
      await toggleCategory({ token, categoryId, name, enabled });
      return { ok: true };
    } catch {
      return { ok: false, error: "Failed to update category" };
    }
  }

  if (intent === "reorder") {
    const token = await getToken(request);
    const orderedCategoryIds = JSON.parse(
      formData.get("orderedIds") as string,
    ) as string[];
    try {
      await reorderCategories({ token, orderedCategoryIds });
      return { ok: true };
    } catch {
      return { ok: false, error: "Failed to reorder categories" };
    }
  }

  const queryParams = getQueryParamsFromFormData({
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate"),
  });

  return redirect(`/categories?${queryParams}`);
}

export default function Accounts() {
  const data = useLoaderData<typeof loader>();
  const userCurrency = data.userCurrency;
  const [items, setItems] = useState(data.categories);
  const previousOrder = useRef(data.categories);
  const [reorderError, setReorderError] = useState<string | null>(null);
  const reorderFetcher = useFetcher<{ ok: boolean; error?: string }>();

  useEffect(() => {
    if (reorderFetcher.state === "idle") {
      setItems(data.categories);
    }
  }, [data.categories, reorderFetcher.state]);

  useEffect(() => {
    if (reorderFetcher.state === "idle" && reorderFetcher.data) {
      if (!reorderFetcher.data.ok) {
        setItems(previousOrder.current);
        setReorderError(
          reorderFetcher.data.error || "Failed to reorder categories",
        );
      }
    }
  }, [reorderFetcher.state, reorderFetcher.data]);

  const sensors = useSensors(useSensor(PointerSensor));

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);
    const newItems = arrayMove(items, oldIndex, newIndex);

    previousOrder.current = items;
    setItems(newItems);
    setReorderError(null);

    reorderFetcher.submit(
      {
        intent: "reorder",
        orderedIds: JSON.stringify(newItems.map((i) => i.id)),
      },
      { method: "POST", action: "/categories" },
    );
  }

  return (
    <Container size="md">
      <Space h="md" />
      <Title order={1}>Categories</Title>
      <Space h="md" />
      {reorderError && (
        <Alert
          color="red"
          withCloseButton
          onClose={() => setReorderError(null)}
          mb="sm"
        >
          {reorderError}
        </Alert>
      )}
      <FiltersCategory />
      <ScrollArea>
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th style={{ width: 40 }} />
              <Table.Th>Edit</Table.Th>
              <Table.Th>Name</Table.Th>
              <Table.Th>Balance</Table.Th>
              <Table.Th>Enabled</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
              <SortableContext
                items={items.map((i) => i.id)}
                strategy={verticalListSortingStrategy}
              >
                {items.map((element) => (
                  <SortableRow key={element.id} id={element.id}>
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
                    <Table.Td>
                      <ToggleEnabled
                        id={element.id}
                        enabled={element.enabled}
                        action="/categories"
                        extraData={{ name: element.name }}
                      />
                    </Table.Td>
                  </SortableRow>
                ))}
              </SortableContext>
            </DndContext>
          </Table.Tbody>
        </Table>
      </ScrollArea>
    </Container>
  );
}
