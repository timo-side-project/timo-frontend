import type { Category } from '@/src/lib/constants/character';

export const CATEGORY_LABEL_MAP: Record<Category, string> = {
  PAST_POSITIVE: '과거 긍정',
  PAST_NEGATIVE: '과거 부정',
  PRESENT_HEDONISTIC: '현재 쾌락',
  PRESENT_FATALISTIC: '현재 운명',
  FUTURE: '미래 지향',
};
