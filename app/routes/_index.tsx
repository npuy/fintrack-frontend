import { Welcome } from "~/components/Welcome/Welcome";

export function meta() {
  return [
    { title: "FinTrack" },
    { name: "description", content: "Welcome to FinTrack!" },
  ];
}

export default function Index() {
  return (
    <>
      <Welcome />
    </>
  );
}
