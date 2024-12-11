import type {
  MetaFunction,
  ActionFunction,
  ActionFunctionArgs,
} from "@remix-run/node";
import { Form, redirect } from "@remix-run/react";
import { getSession, commitSession } from "../sessions";
import { Button, Container, Flex, Space, TextInput } from "@mantine/core";
import { userLoggedIn } from "~/services/authentication/middleware";
import type { User } from "~/types/user";

export const meta: MetaFunction = () => {
  return [{ title: "Login" }];
};

export const action: ActionFunction = async ({
  request,
}: ActionFunctionArgs) => {
  const session = await getSession(request.headers.get("Cookie"));

  // TODO: Add validation and error handling
  const formData = await request.formData();
  const response = await fetch("http://localhost:8000/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: formData.get("email"),
      password: formData.get("password"),
    }),
  });

  if (response.ok) {
    const authToken = response.headers.get("Authorization");
    if (!authToken) {
      return redirect("/login");
    }
    const user: User = await response.json();
    session.set("user", user);
    session.set("authToken", authToken);

    // Remove this block when the API is ready
    fetch("http://localhost:8000/health_check", {
      method: "GET",
      headers: {
        Authorization: authToken,
      },
    });
    // --------------------------------------------

    return redirect("/", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }

  // If the response is not ok, redirect to the login page
  // TODO: Add error handling
  console.log(
    "Error logging in: ",
    response.status,
    (await response.json()).message
  );
  return redirect("/login");
};

export const loader = async ({ request }: ActionFunctionArgs) => {
  if (await userLoggedIn({ request } as ActionFunctionArgs)) {
    return redirect("/");
  }
  return {};
};

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
