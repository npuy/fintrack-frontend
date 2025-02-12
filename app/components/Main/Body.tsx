import { ReactNode } from "react";
import classes from "./Body.module.css";

export function Body({ children }: { children: ReactNode }) {
  return <div className={classes.body}>{children}</div>;
}
