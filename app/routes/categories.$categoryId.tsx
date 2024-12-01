import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [{ title: "Category" }];
};

export default function Category() {
  return (
    <div>
      <h1>Category</h1>
    </div>
  );
}
