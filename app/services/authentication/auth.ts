import { User } from "~/types/user";
import { env } from "~/config/config";
import { SessionDataWithoutCurrency } from "~/types/session";
import { ActionFunctionArgs, Session } from "@remix-run/node";
import { getSession } from "~/sessions";
import { Currency } from "~/types/account";

export async function loginInBackend(
  email: string,
  password: string
): Promise<SessionDataWithoutCurrency> {
  const response = await fetch(`${env.BACKEND_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  if (response.ok) {
    const authToken = response.headers.get("Authorization");
    if (!authToken) {
      throw new Error("No auth token found");
    }
    const user: User = await response.json();
    return {
      user,
      authToken,
    };
  }
  throw new Error("Error logging in");
}

export async function registerInBackend(
  email: string,
  password: string,
  name: string
): Promise<SessionDataWithoutCurrency> {
  const response = await fetch(`${env.BACKEND_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
      name,
    }),
  });

  if (response.ok) {
    const authToken = response.headers.get("Authorization");
    if (!authToken) {
      throw new Error("No auth token found");
    }
    const user: User = await response.json();
    return {
      user,
      authToken,
    };
  }
  throw new Error("Error registering");
}

export function validateLoginData(
  email: FormDataEntryValue | null,
  password: FormDataEntryValue | null
): { email: string; password: string } {
  if (
    !email ||
    !password ||
    typeof email !== "string" ||
    typeof password !== "string"
  ) {
    throw new Error("Invalid login data");
  }
  return {
    email: email as string,
    password: password as string,
  };
}

export function validateRegisterData(
  email: FormDataEntryValue | null,
  password: FormDataEntryValue | null,
  name: FormDataEntryValue | null
): { email: string; password: string; name: string } {
  if (
    !email ||
    !password ||
    !name ||
    typeof email !== "string" ||
    typeof password !== "string" ||
    typeof name !== "string"
  ) {
    throw new Error("Invalid register data");
  }
  return {
    email: email as string,
    password: password as string,
    name: name as string,
  };
}

export async function setSessionData({
  request,
  sessionData,
}: ActionFunctionArgs & {
  sessionData: SessionDataWithoutCurrency;
}): Promise<Session> {
  const response = await fetch(
    `${env.BACKEND_URL}/currency/${sessionData.user.currencyId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: sessionData.authToken,
      },
    }
  );

  const currency: Currency = await response.json();

  const session = await getSession(request.headers.get("Cookie"));

  session.set("user", sessionData.user);
  session.set("authToken", sessionData.authToken);
  session.set("userCurrency", currency);

  return session;
}
