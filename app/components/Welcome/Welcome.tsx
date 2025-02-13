import { Title, Text, Group } from "@mantine/core";
import classes from "./Welcome.module.css";
import { ThemeToggle } from "./ThemeToggle/ThemeToggle";

export function Welcome() {
  return (
    <>
      <Title className={classes.title} ta="center" mt={100}>
        Welcome to{" "}
        <Text
          inherit
          variant="gradient"
          component="span"
          gradient={{ from: "pink", to: "yellow" }}
        >
          FinTrack
        </Text>
      </Title>
      <Text color="dimmed" ta="center" size="lg" maw={580} mx="auto" mt="xl">
        Track your expenses effortlessly, gain insights into your spending
        habits, and plan for the future. FinTrack makes managing your money
        simple, smart, and stress-free.
      </Text>
      <Group mt="xl" justify="center">
        <ThemeToggle />
      </Group>
    </>
  );
}
