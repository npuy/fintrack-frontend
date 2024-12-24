import { useLoaderData } from "@remix-run/react";
import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { userLoggedIn } from "~/services/authentication/middleware";
import NewCategory from "~/components/Category/NewCategory";
import EditCategory from "~/components/Category/EditCategory";

export function meta() {
  return [{ title: "Category" }];
}

export async function loader({ request, params }: ActionFunctionArgs) {
  if (!(await userLoggedIn({ request } as ActionFunctionArgs))) {
    return redirect("/");
  }
  const categoryId = params.categoryId;
  let category = { name: "", id: "new", balance: 0 };
  if (categoryId != "new") {
    category = { name: "Comida", id: "1", balance: 1000 };
  }
  return {
    category,
  };
}

export default function Category() {
  const data = useLoaderData<typeof loader>();

  if (data.category.id == "new") {
    return <NewCategory />;
  }

  return <EditCategory />;
}
