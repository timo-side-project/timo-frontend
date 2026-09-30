import type { Category } from '@/src/lib/constants/character';

export interface CategoryMessageParts {
  prefix: string;
  highlight: string;
  suffix: string;
}

export const CATEGORY_MESSAGE_MAP: Record<Category, CategoryMessageParts> = {
  PAST_NEGATIVE: {
    prefix: '오늘은 ',
    highlight: '부정적인 기억',
    suffix: '을 돌아보는 시간이었어요.',
  },
  PAST_POSITIVE: {
    prefix: '오늘은 ',
    highlight: '긍정적인 기억',
    suffix: '을 돌아보는 시간이었어요.',
  },
  PRESENT_HEDONISTIC: {
    prefix: '오늘은 ',
    highlight: '현재의 즐거움',
    suffix: '을 생각해보는 시간이었어요.',
  },
  PRESENT_FATALISTIC: {
    prefix: '오늘은 ',
    highlight: '현재의 나',
    suffix: '를 그대로 받아들이는 시간을 가져보았어요.',
  },
  FUTURE: {
    prefix: '오늘은 ',
    highlight: '앞으로의 미래',
    suffix: '에 대해 생각해 보는 시간이었어요.',
  },
};
