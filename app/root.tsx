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
import { ActionFunctionArgs, LinksFunction } from "@remix-run/node";
import { getUser } from "./services/authentication/middleware";
import "@mantine/dates/styles.css";
import { Footer } from "./components/Footer/Footer";
import { Body } from "./components/Main/Body";

export const loader = async ({ request }: ActionFunctionArgs) => {
  const user = await getUser(request);
  return { user };
};

export const links: LinksFunction = () => {
  return [
    {
      rel: "icon",
      href: "/favicon.svg",
      type: "image/svg+xml",
    },
  ];
};

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <ColorSchemeScript defaultColorScheme="dark" />
      </head>
      <body>
        <MantineProvider>
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
