import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [{ title: "Transaction" }];
};

export default function Transaction() {
  return (
    <div>
      <h1>Transaction</h1>
    </div>
  );
}
