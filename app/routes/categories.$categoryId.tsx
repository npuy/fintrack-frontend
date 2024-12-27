import { useLoaderData } from "@remix-run/react";
import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { userLoggedIn } from "~/services/authentication/middleware";
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
  if (!(await userLoggedIn({ request } as ActionFunctionArgs))) {
    return redirect("/");
  }
  const categoryId = params.categoryId;
  let category = { name: "", id: "new" };
  if (categoryId != "new") {
    // get category
    category = await getCategory({
      request,
      categoryId,
    } as ActionFunctionArgs & {
      categoryId: string;
    });
  }
  return {
    category,
  };
}

export async function action({ request, params }: ActionFunctionArgs) {
  if (!(await userLoggedIn({ request } as ActionFunctionArgs))) {
    return redirect("/");
  }
  const categoryId = params.categoryId;
  const formData = await request.formData();
  const { name } = validateCategoryData(formData.get("name"));
  if (categoryId == "new") {
    // create category
    await createCategory({ request, name } as ActionFunctionArgs & {
      name: string;
    });
  } else {
    // edit category
    await editCategory({ request, categoryId, name } as ActionFunctionArgs & {
      categoryId: string;
      name: string;
    });
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
