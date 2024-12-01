import type {
  MetaFunction,
  ActionFunction,
  ActionFunctionArgs,
} from "@remix-run/node";
import { Form, redirect } from "@remix-run/react";
import { getSession, commitSession } from "../sessions";

export const meta: MetaFunction = () => {
  return [{ title: "Login" }];
};

interface User {
  id: string;
  name: string;
  email: string;
}

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
    const user: User = await response.json();
    session.set("userId", user.id);
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
  const session = await getSession(request.headers.get("Cookie"));
  if (session.has("userId")) {
    return redirect("/");
  }
  return {};
};

export default function Login() {
  return (
    <div>
      <h1>Login</h1>
      <Form method="post">
        <label>
          Email
          <input type="email" name="email" required />
        </label>
        <label>
          Password
          <input type="password" name="password" required />
        </label>
        <button type="submit">Login</button>
      </Form>
    </div>
  );
}
