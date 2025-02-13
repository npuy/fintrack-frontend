import { Text, Title } from "@mantine/core";
import { Link } from "@remix-run/react";
import classes from "./FinTrackLogo.module.css";

const homeLink = { link: "/", label: "Home" };

export function FintrackLogo() {
  return (
    <Link key={homeLink.label} to={homeLink.link} className={classes.menuItem}>
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
  );
}
