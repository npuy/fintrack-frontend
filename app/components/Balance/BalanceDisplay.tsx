import { Badge } from "@mantine/core";
import classes from "./BalanceDisplay.module.css";

export function BalanceDisplay({
  balance,
  symbol,
}: {
  balance: number;
  symbol: string;
}) {
  const formattedBalance = new Intl.NumberFormat("DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(balance);

  return (
    <Badge
      color={balance >= 0 ? "teal" : "red"}
      size="lg"
      leftSection={symbol}
      className={classes.badge}
    >
      {formattedBalance}
    </Badge>
  );
}
