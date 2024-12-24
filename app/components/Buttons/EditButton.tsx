import { Button } from "@mantine/core";
import { IconEdit } from "@tabler/icons-react";

export default function EditButton() {
  return (
    <Button variant="filled" leftSection={<IconEdit size={16} />} type="submit">
      Edit
    </Button>
  );
}
