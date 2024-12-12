import { User } from "./user";

export interface SessionDataType {
  user: User;
  authToken: string;
}
