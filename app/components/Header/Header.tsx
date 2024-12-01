import { useState } from "react";
import { Burger, Container, Group } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { MantineLogo } from "@mantinex/mantine-logo";
import classes from "./Header.module.css";
import { Link } from "@remix-run/react";

const homeLink = { link: "/", label: "Mantine" };
const links = [
  { link: "/accounts", label: "Accounts" },
  { link: "/categories", label: "Categories" },
  { link: "/transactions", label: "Transactions" },
];

export function Header() {
  const [opened, { toggle }] = useDisclosure(false);
  const [active, setActive] = useState(homeLink.link);

  const items = links.map((link) => (
    <Link
      key={link.label}
      to={link.link}
      className={classes.link}
      data-active={active === link.link || undefined}
      onClick={() => {
        setActive(link.link);
      }}
    >
      {link.label}
    </Link>
  ));

  return (
    <header className={classes.header}>
      <Container size="md" className={classes.inner}>
        <Link
          key={homeLink.label}
          to={homeLink.link}
          data-active={active === homeLink.link || undefined}
          onClick={() => {
            setActive(homeLink.link);
          }}
        >
          <MantineLogo size={28} />
        </Link>
        <Group gap={5} visibleFrom="xs">
          {items}
        </Group>

        <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" />
      </Container>
    </header>
  );
}
