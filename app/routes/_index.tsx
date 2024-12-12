import { Welcome } from "~/components/Welcome/Welcome";
import { ColorSchemeToggle } from "~/components/ColorSchemeToggle/ColorSchemeToggle";

export function meta() {
  return [
    { title: "Mantine Remix App" },
    { name: "description", content: "Welcome to Mantine!" },
  ];
}

export default function Index() {
  return (
    <>
      <Welcome />
      <ColorSchemeToggle />
    </>
  );
}
