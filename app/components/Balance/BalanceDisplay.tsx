import { Badge } from "@mantine/core";
import classes from "./BalanceDisplay.module.css";
import { formatAmount } from "~/utils/amount";

export function BalanceDisplay({
  balance,
  symbol,
}: {
  balance: number;
  symbol: string;
}) {
  const formattedBalance = formatAmount(balance);

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
