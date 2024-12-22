import {
  Button,
  Container,
  Fieldset,
  Flex,
  Space,
  TextInput,
  Title,
} from "@mantine/core";
import { Form, useLoaderData } from "@remix-run/react";
import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { userLoggedIn } from "~/services/authentication/middleware";

export function meta() {
  return [{ title: "Account" }];
}

export async function loader({ request, params }: ActionFunctionArgs) {
  if (!(await userLoggedIn({ request } as ActionFunctionArgs))) {
    return redirect("/");
  }
  if (!params.accountId) {
    return redirect("/accounts");
  }
  const accountId = params.accountId;
  if (accountId == "new") {
    return {
      account: { id: "new" },
    };
  }
  return {
    account: { name: "Cuenta dolares", id: "1", balance: 1000 },
  };
}

export default function Account() {
  const data = useLoaderData<typeof loader>();
  if (data.account.id == "new") {
    return <h1>New account</h1>;
  }

  return (
    <Container size="xs">
      <Fieldset>
        <Space h="md" />
        <Title order={1}>Account</Title>
        <Space h="md" />
        <Form method="post">
          <TextInput label="Name" name="name" required />
          <Space h="md" />
          <Flex justify="flex-end">
            <Button variant="filled" type="submit">
              Create
            </Button>
          </Flex>
        </Form>
      </Fieldset>
    </Container>
  );
}
