import { Button } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";

export default function DeleteButton({ form }: { form?: string }) {
  return (
    <Button
      variant="default"
      leftSection={<IconTrash size={16} />}
      type="submit"
      form={form}
    >
      Delete
    </Button>
  );
}
