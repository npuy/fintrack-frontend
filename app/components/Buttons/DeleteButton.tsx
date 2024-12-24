import { Button } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";

export default function DeleteButton() {
  return (
    <Button
      variant="default"
      leftSection={<IconTrash size={16} />}
      type="button"
    >
      Delete
    </Button>
  );
}
