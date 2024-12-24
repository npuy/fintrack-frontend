import { Button } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";

export default function CreateButton() {
  return (
    <Button variant="filled" leftSection={<IconPlus size={16} />} type="submit">
      Create
    </Button>
  );
}
