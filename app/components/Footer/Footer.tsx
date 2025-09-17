import { IconBrandGithub, IconBrandLinkedin } from "@tabler/icons-react";
import { ActionIcon, Container, Group } from "@mantine/core";
import classes from "./Footer.module.css";
import { FintrackLogo } from "../Logo/FintrackLogo";

export function Footer() {
  return (
    <div className={classes.footer}>
      <Container className={classes.inner}>
        <FintrackLogo />
        <Group
          gap={0}
          className={classes.links}
          justify="flex-end"
          wrap="nowrap"
        >
          <ActionIcon
            component="a"
            href="https://github.com/npuy"
            size="lg"
            color="gray"
            variant="subtle"
          >
            <IconBrandGithub size={18} stroke={1.5} />
          </ActionIcon>
          <ActionIcon
            component="a"
            href="https://www.linkedin.com/in/nicolas-pereira-9b4b83259/"
            size="lg"
            color="gray"
            variant="subtle"
          >
            <IconBrandLinkedin size={18} stroke={1.5} />
          </ActionIcon>
        </Group>
      </Container>
    </div>
  );
}
