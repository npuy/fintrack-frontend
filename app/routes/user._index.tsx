import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [{ title: "User" }];
};

export default function User() {
  return (
    <div>
      <h1>User</h1>
    </div>
  );
}
