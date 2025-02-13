import { Burger, Container, Drawer, Group, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import classes from "./Header.module.css";
import { Link, useLoaderData } from "@remix-run/react";
import { UserMenu } from "./UserMenu/UserMenu";
import { loader } from "~/root";
import { FintrackLogo } from "../Logo/FintrackLogo";

const links = [
  { link: "/dashboard", label: "Dashboard" },
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

  const itemsMobile = links.map((link) => (
    <Link
      key={link.label}
      to={link.link}
      className={classes.menuItem}
      onClick={toggle}
    >
      {link.label}
    </Link>
  ));

  return (
    <header className={classes.header}>
      <Container size="md" className={classes.inner}>
        <FintrackLogo />
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

        <Drawer opened={opened} onClose={toggle}>
          <Stack align="flex-start" justify="flex-start" gap={20}>
            {user ? (
              <>
                {itemsMobile}
                <Link
                  key={"Logout"}
                  to={"/logout"}
                  className={classes.menuItem}
                  onClick={toggle}
                >
                  Logout
                </Link>
              </>
            ) : (
              <>
                <Link
                  key={"Register"}
                  to={"/register"}
                  className={classes.menuItem}
                  onClick={toggle}
                >
                  Register
                </Link>
                <Link
                  key={"Login"}
                  to={"/login"}
                  className={classes.menuItem}
                  onClick={toggle}
                >
                  Login
                </Link>
              </>
            )}
          </Stack>
        </Drawer>

        <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" />
      </Container>
    </header>
  );
}
