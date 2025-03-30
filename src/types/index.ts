
export type Category = 'food' | 'household';

export type Item = {
  id: string;
  name: string;
  category: Category;
  quantity: number;
  expireDate: string;
  purchaseDate?: string;
  createdAt: string;
};

export type ExpirySeverity = 'red' | 'orange' | 'green';

export type SortOption = 'name' | 'expireDate' | 'createdAt';

export type FilterOption = 'all' | 'expiring' | 'expired';

export type CategoryFilter = 'all' | Category;
