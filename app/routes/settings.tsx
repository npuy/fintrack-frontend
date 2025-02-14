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
import { SessionDataWithoutCurrency } from "~/types/session";

export function meta() {
  return [{ title: "Settings" }];
}

export async function loader({ request }: ActionFunctionArgs) {
  const userCurrency = await getCurrency({ request } as ActionFunctionArgs);
  const user = await getUser({ request } as ActionFunctionArgs);
  if (
    !(await userLoggedIn({ request } as ActionFunctionArgs)) ||
    !userCurrency ||
    !user
  ) {
    return redirect("/");
  }

  const currencies = await getCurrencies({ request } as ActionFunctionArgs);
  return { currencies, userCurrency, user };
}

export async function action({ request }: ActionFunctionArgs) {
  const user = await getUser({ request } as ActionFunctionArgs);
  const authToken = await getToken({ request } as ActionFunctionArgs);
  if (
    !(await userLoggedIn({ request } as ActionFunctionArgs)) ||
    !user ||
    !authToken
  ) {
    return redirect("/");
  }

  const formData = await request.formData();
  const { email, currencyId, name } = validateUpdateUserData({
    email: formData.get("email"),
    currencyId: formData.get("currency"),
    name: formData.get("name"),
  });

  // Update user data
  await updateUserData({
    request,
    email,
    currencyId,
    name,
  } as ActionFunctionArgs & {
    email: string;
    currencyId: number;
    name: string;
  });

  // Update session data
  user.email = email;
  user.name = name;
  user.currencyId = currencyId;
  const session = await setSessionData({
    request,
    sessionData: {
      user: user,
      authToken: authToken,
    },
  } as ActionFunctionArgs & { sessionData: SessionDataWithoutCurrency });

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
