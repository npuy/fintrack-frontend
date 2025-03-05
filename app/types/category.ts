export interface Category {
  id: string;
  name: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryWithBalance extends Category {
  balance: number;
}

export interface CategoryFiltersInput {
  startDate?: string;
  endDate?: string;
}
