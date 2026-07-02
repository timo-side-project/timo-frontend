import type { Category } from '@/src/lib/constants/character';
import { CATEGORY } from '@/src/lib/constants/character';

export const sortByCategory = <T extends { category: Category }>(
  items: T[],
): T[] =>
  [...items].sort(
    (a, b) => CATEGORY.indexOf(a.category) - CATEGORY.indexOf(b.category),
  );
