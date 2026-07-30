import type { Category } from '@/src/lib/constants/character';

import { CATEGORY_LABEL_MAP } from '../constants/categoryLabels';

/** 소수점 한 자리로 반올림했을 때 0.0%가 되지 않도록 하는 표시 하한값 */
const MIN_DISPLAY_RATE = 0.1;

export interface ScoreMessageParts {
  /** 카테고리 색 강조: "과거 부정 지수" */
  category: string;
  /** 흰색 조사: "가 " */
  particle: string;
  /** 카테고리 색 강조: "0.2%" — 변화가 없으면 빈 문자열 */
  highlight: string;
  /** 흰색: " 올랐어요." */
  suffix: string;
}

interface ScoreMessageParams {
  category: Category;
  changedScore: number;
  isIncreased: boolean;
}

export const getScoreMessage = ({
  category,
  changedScore,
  isIncreased,
}: ScoreMessageParams): ScoreMessageParts => {
  const label = CATEGORY_LABEL_MAP[category];
  const categoryText = `${label} 지수`;
  const absoluteScore = Math.abs(changedScore);

  if (absoluteScore === 0) {
    return {
      category: categoryText,
      particle: '가 ',
      highlight: '',
      suffix: '그대로예요.',
    };
  }

  const verb = isIncreased ? '올랐어요' : '내렸어요';
  const rate = Math.max(absoluteScore, MIN_DISPLAY_RATE).toFixed(1);

  return {
    category: categoryText,
    particle: '가 ',
    highlight: `${rate}%`,
    suffix: ` ${verb}.`,
  };
};
