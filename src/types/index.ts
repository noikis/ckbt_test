export type CategoryType = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  createdAt: Date;
  active: boolean;
};

export type CategoryAttributeType = keyof CategoryType;

export type SortType = 'ASC' | 'DESC';

export type CategorySortType = {
  attribute: CategoryAttributeType;
  order: SortType;
};
