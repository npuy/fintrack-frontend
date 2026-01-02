import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { deleteCategory } from "~/services/category/category";
import { getToken, userLoggedIn } from "~/services/authentication/middleware";

export async function action({ request, params }: ActionFunctionArgs) {
  const categoryId = params.categoryId;
  if (!(await userLoggedIn(request)) || !categoryId) {
    return redirect("/");
  }
  const token = await getToken(request);
  await deleteCategory({ token, categoryId });
  return redirect("/categories");
}
