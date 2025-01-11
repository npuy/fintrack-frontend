import { createCookieSessionStorage } from "@remix-run/node";
import type { SessionDataType } from "~/types/session";
import { env } from "~/config/config";

type SessionData = SessionDataType;

type SessionFlashData = {
  error: string;
};

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage<SessionData, SessionFlashData>({
    cookie: {
      name: "__session",
      httpOnly: true,
      maxAge: 60 * 60,
      path: "/",
      sameSite: "lax",
      secrets: [env.SESSION_SECRET],
      secure: false,
    },
  });

export { getSession, commitSession, destroySession };
