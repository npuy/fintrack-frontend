import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { EditBudgetGroup } from "~/components/BudgetGroup/EditBudgetGroup";
import { NewBudgetGroup } from "~/components/BudgetGroup/NewBudgetGroup";
import { getToken, userLoggedIn } from "~/services/authentication/middleware";
import {
  createBudgetGroup,
  getBudgetGroup,
  updateBudgetGroup,
  validateBudgetData,
} from "~/services/budget/budget";
import { getCategories } from "~/services/category/category";
import { getCurrencies } from "~/services/currency/currency";

export function meta() {
  return [{ title: "Budget" }];
}

export async function action({ request, params }: ActionFunctionArgs) {
  const token = await getToken({ request } as ActionFunctionArgs);
  if (!(await userLoggedIn({ request } as ActionFunctionArgs)) || !token) {
    return redirect("/");
  }

  const budgetId = params.budgetId as string;
  const formData = await request.formData();

  const result = validateBudgetData(formData);

  if (!result.success) {
    return {
      errors: result.errors,
      values: result.values,
    };
  }
  const { name, limit, currency, categories } = result.data;

  const budgetData = {
    id: budgetId,
    name,
    limit,
    currencyId: currency,
    categoriesId: categories,
  };

  if (budgetId == "new") {
    await createBudgetGroup({
      token,
      budgetData,
    });
  } else {
    await updateBudgetGroup({
      token,
      budgetData,
    });
  }
  return redirect("/dashboard");
}

export async function loader({ request, params }: ActionFunctionArgs) {
  const token = await getToken({ request } as ActionFunctionArgs);
  if (!(await userLoggedIn({ request } as ActionFunctionArgs)) || !token) {
    return redirect("/");
  }

  const budgetId = params.budgetId as string;
  const budgetGroup = await getBudgetGroup({ token, budgetId });

  const currencies = await getCurrencies({ request } as ActionFunctionArgs);

  const categories = await getCategories({ request } as ActionFunctionArgs);

  return {
    budgetGroup,
    currencies,
    categories,
  };
}

export default function Budget() {
  const data = useLoaderData<typeof loader>();

  if (data.budgetGroup.id == "new") {
    return <NewBudgetGroup />;
  } else {
    return <EditBudgetGroup />;
  }
}
