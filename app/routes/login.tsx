import type { ActionFunctionArgs } from "@remix-run/node";
import { Form, redirect } from "@remix-run/react";
import { getSession, commitSession } from "../sessions";
import { Button, Container, Flex, Space, TextInput } from "@mantine/core";
import { userLoggedIn } from "~/services/authentication/middleware";
import {
  loginInBackend,
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

    const session = await getSession(request.headers.get("Cookie"));

    session.set("user", sessionData.user);
    session.set("authToken", sessionData.authToken);

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
  if (await userLoggedIn({ request } as ActionFunctionArgs)) {
    return redirect("/");
  }
  return {};
}

export default function Login() {
  return (
    <Container size="xs">
      <h1>Login</h1>
      <Form method="post">
        <TextInput label="Email" name="email" required />
        <TextInput label="Password" name="password" type="password" required />
        <Space h="md" />
        <Flex justify="flex-end">
          <Button variant="filled" type="submit">
            Login
          </Button>
        </Flex>
      </Form>
    </Container>
  );
}
