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
  Flex,
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
import NewButton from "~/components/Buttons/NewButton";
import { SortableRow } from "~/components/SortableRow/SortableRow";
import { ToggleEnabled } from "~/components/Toggle/ToggleEnabled";
import {
  getAccountsWithBalance,
  reorderAccounts,
  toggleAccount,
} from "~/services/account/account";
import { getToken, userLoggedIn } from "~/services/authentication/middleware";

export function meta() {
  return [{ title: "Accounts" }];
}

export async function loader({ request }: ActionFunctionArgs) {
  if (!(await userLoggedIn(request))) {
    return redirect("/");
  }
  const token = await getToken(request);
  const accounts = await getAccountsWithBalance({ token });
  return { accounts };
}

export async function action({ request }: ActionFunctionArgs) {
  const token = await getToken(request);
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "toggle") {
    const accountId = formData.get("id") as string;
    const name = formData.get("name") as string;
    const currencyId = Number(formData.get("currencyId"));
    const enabled = formData.get("enabled") === "true";

    try {
      await toggleAccount({ token, accountId, name, currencyId, enabled });
      return { ok: true };
    } catch {
      return { ok: false, error: "Failed to update account" };
    }
  }

  if (intent === "reorder") {
    const orderedAccountIds = JSON.parse(
      formData.get("orderedIds") as string,
    ) as string[];
    try {
      await reorderAccounts({ token, orderedAccountIds });
      return { ok: true };
    } catch {
      return { ok: false, error: "Failed to reorder accounts" };
    }
  }

  return null;
}

export default function Accounts() {
  const data = useLoaderData<typeof loader>();
  const [items, setItems] = useState(data.accounts);
  const previousOrder = useRef(data.accounts);
  const [reorderError, setReorderError] = useState<string | null>(null);
  const reorderFetcher = useFetcher<{ ok: boolean; error?: string }>();

  useEffect(() => {
    if (reorderFetcher.state === "idle") {
      setItems(data.accounts);
    }
  }, [data.accounts, reorderFetcher.state]);

  useEffect(() => {
    if (reorderFetcher.state === "idle" && reorderFetcher.data) {
      if (!reorderFetcher.data.ok) {
        setItems(previousOrder.current);
        setReorderError(
          reorderFetcher.data.error || "Failed to reorder accounts",
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
      { method: "POST", action: "/accounts" },
    );
  }

  return (
    <Container size="md">
      <Space h="md" />
      <Title order={1}>Accounts</Title>
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
      <Flex justify="flex-end">
        <NewButton link="/accounts/new">Account</NewButton>
      </Flex>
      <Space h="md" />
      <ScrollArea>
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th style={{ width: 40 }} />
              <Table.Th>Edit</Table.Th>
              <Table.Th>Name</Table.Th>
              <Table.Th>Balance</Table.Th>
              <Table.Th>Currency</Table.Th>
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
                        href={"/accounts/" + element.id}
                        leftSection={<IconEdit size={16} />}
                      >
                        Edit
                      </Button>
                    </Table.Td>
                    <Table.Td>{element.name}</Table.Td>
                    <Table.Td>
                      <BalanceDisplay
                        balance={element.balance}
                        symbol={element.currency.symbol}
                      />
                    </Table.Td>
                    <Table.Td>{element.currency.name}</Table.Td>
                    <Table.Td>
                      <ToggleEnabled
                        id={element.id}
                        enabled={element.enabled}
                        action="/accounts"
                        extraData={{
                          name: element.name,
                          currencyId: String(element.currencyId),
                        }}
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
