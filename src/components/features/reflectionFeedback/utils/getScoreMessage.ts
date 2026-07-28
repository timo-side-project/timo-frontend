import type { Category } from '@/src/lib/constants/character';

import { CATEGORY_LABEL_MAP } from '../constants/categoryLabels';

export interface ScoreMessageParts {
  /** 카테고리 색 강조: "과거 부정 지수" */
  category: string;
  /** 흰색 조사: "가 " */
  particle: string;
  /** 카테고리 색 강조: "0.2%" */
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
  const verb = isIncreased ? '올랐어요' : '내렸어요';
  const rate = Math.abs(changedScore).toFixed(1);

  return {
    category: `${label} 지수`,
    particle: '가 ',
    highlight: `${rate}%`,
    suffix: ` ${verb}.`,
  };
};
