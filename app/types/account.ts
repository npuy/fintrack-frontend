export interface Currency {
  id: number;
  name: string;
  symbol: string;
  multiplier: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Account {
  id: string;
  name: string;
  currencyId: number;
  currency: Currency;
  userId: string;
  enabled: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface AccountWithBalance extends Account {
  balance: number;
}
