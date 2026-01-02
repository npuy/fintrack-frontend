import { Container, Fieldset, Space, Title } from "@mantine/core";
import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { FormSettings } from "~/components/Settings/FormSettings";
import { setSessionData } from "~/services/authentication/auth";
import {
  getCurrency,
  getToken,
  getUser,
  userLoggedIn,
} from "~/services/authentication/middleware";
import { getCurrencies } from "~/services/currency/currency";
import { updateUserData, validateUpdateUserData } from "~/services/user/user";
import { commitSession } from "~/sessions";

export function meta() {
  return [{ title: "Settings" }];
}

export async function loader({ request }: ActionFunctionArgs) {
  const userCurrency = await getCurrency(request);
  const user = await getUser(request);
  if (!(await userLoggedIn(request)) || !userCurrency || !user) {
    return redirect("/");
  }

  const token = await getToken(request);
  const currencies = await getCurrencies({ token });
  return { currencies, userCurrency, user };
}

export async function action({ request }: ActionFunctionArgs) {
  const user = await getUser(request);
  const authToken = await getToken(request);
  if (!(await userLoggedIn(request)) || !user || !authToken) {
    return redirect("/");
  }

  const formData = await request.formData();
  const result = validateUpdateUserData(formData);

  if (!result.success) {
    return { errors: result.errors, values: result.values };
  }

  const { email, currency: currencyId, name, payDay } = result.data;

  // Update user data
  await updateUserData({
    token: authToken,
    email,
    currencyId,
    name,
    payDay,
  });

  // Update session data
  user.email = email;
  user.name = name;
  user.currencyId = currencyId;
  user.payDay = payDay;
  const session = await setSessionData({
    request,
    sessionData: {
      user: user,
      authToken: authToken,
    },
  });

  return redirect("/", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export default function Settings() {
  const data = useLoaderData<typeof loader>();

  const loadData = {
    name: data.user.name,
    email: data.user.email,
    currency: String(data.userCurrency.id),
    payDay: data.user.payDay,
  };

  return (
    <Container size="xs">
      <Fieldset>
        <Space h="md" />
        <Title order={1}>Update user data</Title>
        <Space h="md" />

        <FormSettings loadData={loadData} />
      </Fieldset>
    </Container>
  );
}
