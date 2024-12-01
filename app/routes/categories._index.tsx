import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [{ title: "Categories" }];
};

export default function Categories() {
  return (
    <div>
      <h1>Categories</h1>
    </div>
  );
}
