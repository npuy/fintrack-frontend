import { Category } from "./category";

export interface BudgetGroup {
  id: string;
  name: string;
  limit: number;
  currencyId: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BudgetGroupWithCategories extends BudgetGroup {
  categories: Category[];
}

export interface BudgetGroupWithCategoriesAndAmount
  extends BudgetGroupWithCategories {
  amount: number;
}

export interface UpdateBudgetGroupInput {
  id: string;
  name: string;
  limit: number;
  currencyId: number;
  categoriesId: string[];
}
