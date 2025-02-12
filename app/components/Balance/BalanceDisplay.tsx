import { Badge } from "@mantine/core";
import classes from "./BalanceDisplay.module.css";

export function BalanceDisplay({
  balance,
  symbol,
}: {
  balance: number;
  symbol: string;
}) {
  return (
    <Badge
      color={balance >= 0 ? "teal" : "red"}
      size="lg"
      leftSection={symbol}
      className={classes.badge}
    >
      {(Math.round(balance * 100) / 100).toFixed(2)}
    </Badge>
  );
}
