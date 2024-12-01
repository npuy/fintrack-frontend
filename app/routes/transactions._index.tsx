import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [{ title: "Transactions" }];
};

export default function Transactions() {
  return (
    <div>
      <h1>Transactions</h1>
    </div>
  );
}
