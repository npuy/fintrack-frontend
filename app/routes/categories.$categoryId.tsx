import { useLoaderData } from "@remix-run/react";
import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { getToken, userLoggedIn } from "~/services/authentication/middleware";
import NewCategory from "~/components/Category/NewCategory";
import EditCategory from "~/components/Category/EditCategory";
import {
  createCategory,
  editCategory,
  getCategory,
  validateCategoryData,
} from "~/services/category/category";

export function meta() {
  return [{ title: "Category" }];
}

export async function loader({ request, params }: ActionFunctionArgs) {
  const categoryId = params.categoryId;
  if (!(await userLoggedIn(request)) || !categoryId) {
    return redirect("/");
  }

  let category = { name: "", id: "new" };
  const token = await getToken(request);
  if (categoryId != "new") {
    // get category
    category = await getCategory({
      token,
      categoryId,
    });
  }
  return {
    category,
  };
}

export async function action({ request, params }: ActionFunctionArgs) {
  const categoryId = params.categoryId;
  if (!(await userLoggedIn(request)) || !categoryId) {
    return redirect("/");
  }

  const formData = await request.formData();

  const result = validateCategoryData(formData);

  if (!result.success) {
    return {
      errors: result.errors,
      values: result.values,
    };
  }

  const { name } = result.data;

  const token = await getToken(request);
  if (categoryId == "new") {
    // create category
    await createCategory({ token, name });
  } else {
    // edit category
    await editCategory({ token, categoryId, name });
  }
  return redirect("/categories");
}

export default function Category() {
  const data = useLoaderData<typeof loader>();

  if (data.category.id == "new") {
    return <NewCategory />;
  }

  return <EditCategory />;
}
