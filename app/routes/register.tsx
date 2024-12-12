import type { ActionFunctionArgs } from "@remix-run/node";
import { Form, redirect } from "@remix-run/react";
import { getSession, commitSession } from "../sessions";
import { Button, Container, Flex, Space, TextInput } from "@mantine/core";
import { userLoggedIn } from "~/services/authentication/middleware";
import {
  registerInBackend,
  validateRegisterData,
} from "~/services/authentication/auth";

export function meta() {
  return [{ title: "Register" }];
}

export async function action({ request }: ActionFunctionArgs) {
  try {
    const formData = await request.formData();

    const { email, password } = validateRegisterData(
      formData.get("email"),
      formData.get("password"),
      formData.get("name")
    );

    const sessionData = await registerInBackend(email, password);

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
    return redirect("/register");
  }
}

export async function loader({ request }: ActionFunctionArgs) {
  if (await userLoggedIn({ request } as ActionFunctionArgs)) {
    return redirect("/");
  }
  return {};
}

export default function Register() {
  return (
    <Container size="xs">
      <h1>Register</h1>
      <Form method="post">
        <TextInput label="Name" name="name" type="text" required />
        <TextInput label="Email" name="email" type="email" required />
        <TextInput label="Password" name="password" type="password" required />
        <Space h="md" />
        <Flex justify="flex-end">
          <Button variant="filled" type="submit">
            Register
          </Button>
        </Flex>
      </Form>
    </Container>
  );
}
