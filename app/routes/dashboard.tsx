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
  const userCurrency = await getCurrency(request);
  if (!(await userLoggedIn(request)) || !userCurrency) {
    return redirect("/");
  }

  const token = await getToken(request);
  const budgetGroups = await getBudgetGroups({ token });
  const currencies = await getCurrencies({ token });
  const categories = await getCategoriesWithBalance({ token });

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
