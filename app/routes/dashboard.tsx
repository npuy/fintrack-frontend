import { Container, Group } from "@mantine/core";
import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { BudgetGroup } from "~/components/BudgetGroup/BudgetGroup";
import { StatsSegments } from "~/components/Dashboard/StatsSegments";
import {
  getCurrency,
  getToken,
  userLoggedIn,
} from "~/services/authentication/middleware";
import { getBudgetGroups } from "~/services/budget/budget";
import { getCategoriesWithBalance } from "~/services/category/category";
import { getCurrencies } from "~/services/currency/currency";

export function meta() {
  return [{ title: "Dashboard" }];
}

export async function loader({ request }: ActionFunctionArgs) {
  const token = await getToken({ request } as ActionFunctionArgs);
  const userCurrency = await getCurrency({ request } as ActionFunctionArgs);
  if (
    !(await userLoggedIn({ request } as ActionFunctionArgs)) ||
    !token ||
    !userCurrency
  ) {
    return redirect("/");
  }

  const budgetGroups = await getBudgetGroups({ token });
  const currencies = await getCurrencies({ request } as ActionFunctionArgs);
  const categories = await getCategoriesWithBalance({
    request,
  } as ActionFunctionArgs);

  return { budgetGroups, currencies, categories, userCurrency };
}

export default function Dashboard() {
  return (
    <Container size="md">
      <Group justify="center" gap="xl" mb={100} mt={60}>
        <StatsSegments />
      </Group>

      <Group mb={100}>
        <BudgetGroup />
      </Group>
    </Container>
  );
}
