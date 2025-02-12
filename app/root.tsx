import "@mantine/core/styles.css";

import { MantineProvider, ColorSchemeScript } from "@mantine/core";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { Header } from "./components/Header/Header";
import { ActionFunctionArgs } from "@remix-run/node";
import { getUser } from "./services/authentication/middleware";
import "@mantine/dates/styles.css";
import { Footer } from "./components/Footer/Footer";
import { Body } from "./components/Main/Body";

export const loader = async ({ request }: ActionFunctionArgs) => {
  const user = await getUser({ request } as ActionFunctionArgs);
  return { user };
};

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider defaultColorScheme="dark">
          <Header />
          <Body>
            <Outlet />
          </Body>
          <Footer />
        </MantineProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
