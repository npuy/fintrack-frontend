import { Currency } from "./account";
import { User } from "./user";

export interface SessionDataType {
  user: User;
  userCurrency: Currency;
  authToken: string;
}

export interface SessionDataWithoutCurrency {
  user: User;
  authToken: string;
}
