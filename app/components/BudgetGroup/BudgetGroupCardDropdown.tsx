import { ActionIcon, Group, Menu } from "@mantine/core";
import { Link } from "@remix-run/react";
import { IconDots, IconEdit } from "@tabler/icons-react";

export function BudgetGroupCardDropdown({ budgetId }: { budgetId: string }) {
  const editLink = `/budget/${budgetId}`;

  return (
    <Menu shadow="md" width={130} position="bottom-end">
      <Group
        justify="flex-end"
        style={{
          position: "absolute",
          top: 15,
          right: 15,
        }}
      >
        <Menu.Target>
          <ActionIcon size="sm" variant="transparent" color="gray">
            <IconDots />
          </ActionIcon>
        </Menu.Target>
      </Group>
      <Menu.Dropdown>
        <Menu.Item
          leftSection={<IconEdit size={14} />}
          component={Link}
          to={editLink}
        >
          Edit
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
