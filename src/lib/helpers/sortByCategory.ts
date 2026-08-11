import type { Category } from '@/src/lib/constants/character';
import { CATEGORY } from '@/src/lib/constants/character';

const getOrder = (category: Category | null) =>
  category ? CATEGORY.indexOf(category) : CATEGORY.length;

export const sortByCategory = <T extends { category: Category | null }>(
  items: T[],
): T[] =>
  [...items].sort((a, b) => getOrder(a.category) - getOrder(b.category));
