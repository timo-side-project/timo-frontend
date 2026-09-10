'use client';

import { format } from 'date-fns';

import Skeleton from '@/src/components/ui/Skeleton/Skeleton';

import { useGroupKeywordsQuery } from '../../queries/useGroupKeywordsQuery';
import WordRankingCard from '../WordRankingCard/WordRankingCard';

const KEYWORD_COUNT = 3;

interface WordRankingSectionProps {
  groupId: number;
  groupName: string;
}

const WordRankingSection = ({
  groupId,
  groupName,
}: WordRankingSectionProps) => {
  const { data, isPending } = useGroupKeywordsQuery(groupId);

  const keywords = [...(data?.keywords ?? [])].sort(
    (a, b) => b.count - a.count,
  );

  if (!isPending && keywords.length === 0) {
    return null;
  }

  return (
    <section className="flex flex-col gap-6.25">
      <h2 className="font-heading-h4 text-g-0">
        {groupName}에서{' '}
        <span className="text-primary">{format(new Date(), 'MM')}월</span> 가장
        많이 사용한 단어
      </h2>

      <ul className="flex gap-3">
        {isPending
          ? Array.from({ length: KEYWORD_COUNT }).map((_, index) => (
              <li key={index} className="flex-1">
                <Skeleton
                  className="h-24 rounded-10"
                  ariaLabel="단어 순위 로딩"
                />
              </li>
            ))
          : keywords.map((keyword, index) => (
              <WordRankingCard
                key={keyword.word}
                className="min-w-0 flex-1"
                rank={index + 1}
                word={keyword.word}
                count={keyword.count}
              />
            ))}
      </ul>
    </section>
  );
};

export default WordRankingSection;
