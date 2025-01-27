import {
  Button,
  Container,
  Fieldset,
  Flex,
  Select,
  Space,
  TextInput,
  Title,
} from "@mantine/core";
import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { useState } from "react";
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
  const [name, setName] = useState(data.user.name);
  const [email, setEmail] = useState(data.user.email);
  const userCurrencyId = String(data.userCurrency.id);
  const [currencyId, setCurrencyId] = useState<string | null>(userCurrencyId);
  const currenciesSelectData = data.currencies.map((currency) => ({
    value: String(currency.id),
    label: currency.name,
  }));

  return (
    <Container size="xs">
      <Fieldset>
        <Space h="md" />
        <Title order={1}>Update user data</Title>
        <Space h="md" />

        <Form method="post">
          <TextInput
            label="Name"
            name="name"
            type="text"
            required
            value={name}
            onChange={(event) => setName(event.currentTarget.value)}
          />
          <TextInput
            label="Email"
            name="email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.currentTarget.value)}
          />
          <Select
            label="Display currency"
            name="currency"
            description="Currency used to display amounts"
            data={currenciesSelectData}
            value={currencyId}
            onChange={(value) => setCurrencyId(value)}
            required
            nothingFoundMessage="Nothing found..."
          />
          <Space h="md" />
          <Flex justify="flex-end">
            <Button variant="filled" type="submit">
              Update
            </Button>
          </Flex>
        </Form>
      </Fieldset>
    </Container>
  );
}
