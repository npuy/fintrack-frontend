import { Burger, Container, Group, Text, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import classes from "./Header.module.css";
import { Link, useLoaderData } from "@remix-run/react";
import { UserMenu } from "./UserMenu/UserMenu";
import { loader } from "~/root";

const homeLink = { link: "/", label: "Home" };

const links = [
  { link: "/accounts", label: "Accounts" },
  { link: "/categories", label: "Categories" },
  { link: "/transactions", label: "Transactions" },
];

export function Header() {
  const { user } = useLoaderData<typeof loader>();
  const [opened, { toggle }] = useDisclosure(false);

  const items = links.map((link) => (
    <Link key={link.label} to={link.link} className={classes.link}>
      {link.label}
    </Link>
  ));

  return (
    <header className={classes.header}>
      <Container size="md" className={classes.inner}>
        <Link
          key={homeLink.label}
          to={homeLink.link}
          className={classes.menuItem}
        >
          <Title className={classes.title} ta="center">
            <Text
              inherit
              variant="gradient"
              component="span"
              gradient={{ from: "pink", to: "yellow" }}
            >
              FinTrack
            </Text>
          </Title>
        </Link>
        <Group gap={5} visibleFrom="xs">
          {user ? (
            <>
              {items}
              <UserMenu />
            </>
          ) : (
            <>
              <Link key={"Register"} to={"/register"} className={classes.link}>
                Register
              </Link>
              <Link key={"Login"} to={"/login"} className={classes.loginLink}>
                Login
              </Link>
            </>
          )}
        </Group>

        <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" />
      </Container>
    </header>
  );
}
