import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [{ title: "Account" }];
};

export default function Account() {
  return (
    <div>
      <h1>Account</h1>
    </div>
  );
}
