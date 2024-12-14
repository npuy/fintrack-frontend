import { Burger, Container, Group } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { MantineLogo } from "@mantinex/mantine-logo";
import classes from "./Header.module.css";
import { Link, useLoaderData } from "@remix-run/react";
import { UserMenu } from "../UserMenu/UserMenu";
import { User } from "~/types/user";

const homeLink = { link: "/", label: "Home" };

const links = [
  { link: "/accounts", label: "Accounts" },
  { link: "/categories", label: "Categories" },
  { link: "/transactions", label: "Transactions" },
];

export function Header() {
  const { user } = useLoaderData() as { user: User };
  const [opened, { toggle }] = useDisclosure(false);

  const items = links.map((link) => (
    <Link key={link.label} to={link.link} className={classes.link}>
      {link.label}
    </Link>
  ));

  return (
    <header className={classes.header}>
      <Container size="md" className={classes.inner}>
        <Link key={homeLink.label} to={homeLink.link}>
          <MantineLogo size={28} />
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
