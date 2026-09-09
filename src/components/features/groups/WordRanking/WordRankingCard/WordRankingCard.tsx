import { type ComponentProps } from 'react';

import { cn } from '@/src/lib/helpers/cn';

interface WordRankingCardProps extends ComponentProps<'li'> {
  rank: number;
  word: string;
  count: number;
}

const WordRankingCard = ({
  rank,
  word,
  count,
  className,
  ...props
}: WordRankingCardProps) => {
  return (
    <li
      className={cn(
        'bg-g-80 w-27.25 shrink-0 rounded-10 px-4.25 py-2.5',
        className,
      )}
      {...props}
    >
      <p className="font-heading-h3 text-g-60">{rank}</p>

      <div className="mt-1.75 text-right">
        <p className="font-label-n text-g-900 truncate">{word}</p>
        <p className="font-caption-n text-g-400 mt-1.25">총 {count}회</p>
      </div>
    </li>
  );
};

export default WordRankingCard;
