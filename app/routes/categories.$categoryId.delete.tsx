import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { deleteCategory } from "~/services/category/category";
import { userLoggedIn } from "~/services/authentication/middleware";

export async function action({ request, params }: ActionFunctionArgs) {
  if (!(await userLoggedIn({ request } as ActionFunctionArgs))) {
    return redirect("/");
  }
  const categoryId = params.categoryId;
  await deleteCategory({ request, categoryId } as ActionFunctionArgs & {
    categoryId: string;
  });
  return redirect("/categories");
}
