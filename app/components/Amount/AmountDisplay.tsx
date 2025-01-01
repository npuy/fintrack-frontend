import { ReactNode } from "react";
import classes from "./AmountDisplay.module.css";
import { TransactionType } from "~/types/transaction";

export function AmountDisplay({
  children,
  type,
}: {
  children: ReactNode;
  type: TransactionType;
}) {
  return (
    <div
      className={
        type === TransactionType.Income ? classes.income : classes.expense
      }
    >
      {children}
    </div>
  );
}
