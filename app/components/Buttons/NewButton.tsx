import { Button } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { ReactNode } from "react";

interface NewButtonProps {
  children: ReactNode;
  link: string;
}

export default function NewButton({ children, link }: NewButtonProps) {
  return (
    <Button component="a" href={link} leftSection={<IconPlus size={16} />}>
      New {children}
    </Button>
  );
}
