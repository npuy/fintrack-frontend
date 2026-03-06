import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Table, useComputedColorScheme } from "@mantine/core";
import { IconGripVertical } from "@tabler/icons-react";

interface Props {
  id: string;
  children: React.ReactNode;
}

export function SortableRow({ id, children }: Props) {
  const colorScheme = useComputedColorScheme("light");
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const dragBg =
    colorScheme === "dark"
      ? "var(--mantine-color-dark-4)"
      : "var(--mantine-color-blue-0)";

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    backgroundColor: isDragging ? dragBg : undefined,
    boxShadow: isDragging ? "0 4px 12px rgba(0,0,0,0.15)" : undefined,
    opacity: isDragging ? 0.9 : 1,
    zIndex: isDragging ? 1 : undefined,
  };

  return (
    <Table.Tr ref={setNodeRef} style={style}>
      <Table.Td
        style={{ cursor: isDragging ? "grabbing" : "grab", width: 40 }}
        {...attributes}
        {...listeners}
      >
        <IconGripVertical size={16} color="var(--mantine-color-gray-5)" />
      </Table.Td>
      {children}
    </Table.Tr>
  );
}
