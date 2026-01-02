import type { ActionFunctionArgs } from "@remix-run/node";
import { Form, redirect } from "@remix-run/react";
import { commitSession } from "../sessions";
import {
  Button,
  Container,
  Fieldset,
  Flex,
  PasswordInput,
  Space,
  TextInput,
  Title,
} from "@mantine/core";
import { userLoggedIn } from "~/services/authentication/middleware";
import {
  loginInBackend,
  setSessionData,
  validateLoginData,
} from "~/services/authentication/auth";

export function meta() {
  return [{ title: "Login" }];
}

export async function action({ request }: ActionFunctionArgs) {
  try {
    const formData = await request.formData();

    const { email, password } = validateLoginData(
      formData.get("email"),
      formData.get("password")
    );

    const sessionData = await loginInBackend(email, password);

    const session = await setSessionData({
      request,
      sessionData,
    });

    return redirect("/", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  } catch (error) {
    console.error(error);
    return redirect("/login");
  }
}

export async function loader({ request }: ActionFunctionArgs) {
  if (await userLoggedIn(request)) {
    return redirect("/");
  }
  return {};
}

export default function Login() {
  return (
    <Container size="xs">
      <Fieldset>
        <Space h="md" />
        <Title order={1}>Login</Title>
        <Space h="md" />
        <Form method="post">
          <TextInput label="Email" name="email" required />
          <PasswordInput label="Password" name="password" required />
          <Space h="md" />
          <Flex justify="flex-end">
            <Button variant="filled" type="submit">
              Login
            </Button>
          </Flex>
        </Form>
      </Fieldset>
    </Container>
  );
}
