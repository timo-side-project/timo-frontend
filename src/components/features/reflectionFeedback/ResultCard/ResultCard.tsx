import Image from 'next/image';

import Badge from '@/src/components/ui/Badge/Badge';
import Card from '@/src/components/ui/Card/Card';
import Icon from '@/src/components/ui/Icon/Icon';
import {
  type Category,
  CATEGORY_CHARACTER_MAP,
} from '@/src/lib/constants/character';
import { cn } from '@/src/lib/helpers/cn';

import { getScoreMessage } from '../utils/getScoreMessage';

interface ResultCardProps {
  feedback: string;
  category: Category;
  changedScore: number;
  isIncreased: boolean;
  streakDays: number;
}

const ResultCard = ({
  feedback,
  category,
  changedScore,
  isIncreased,
  streakDays,
}: ResultCardProps) => {
  const badgeLabel =
    streakDays <= 1 ? '첫 회고 달성!' : `${streakDays}일 연속 회고 중!`;
  const scoreMessage = getScoreMessage({ category, changedScore, isIncreased });
  const characterAsset = CATEGORY_CHARACTER_MAP[category];

  // 200px = PageHeader(56) + page pt-10(40) + page pb-24(96) + buffer(8)
  return (
    <Card className="flex flex-col items-center gap-6 py-10 px-8  min-h-115 max-h-[calc(100dvh-200px)]">
      <Badge variant="neutral">
        <div className="flex items-center gap-1">
          <Icon name="check" size={16} />
          <p>{badgeLabel}</p>
        </div>
      </Badge>

      <Image
        src={characterAsset.src}
        alt={characterAsset.alt}
        width={150}
        height={150}
      />

      <p className="text-center font-heading-h3 text-g-0">
        <span className={characterAsset.color}>{scoreMessage.category}</span>
        {scoreMessage.particle}
        <span className={characterAsset.color}>{scoreMessage.highlight}</span>
        {scoreMessage.suffix}
      </p>

      <div
        className={cn(
          'flex-1 min-h-16 overflow-y-scroll pr-2',
          '[scrollbar-width:thin]',
          '[scrollbar-color:color-mix(in_srgb,var(--color-g-0)_25%,transparent)_transparent]',
          '[&::-webkit-scrollbar]:w-2.5',
          '[&::-webkit-scrollbar-track]:bg-transparent',
          '[&::-webkit-scrollbar-thumb]:rounded-full',
          '[&::-webkit-scrollbar-thumb]:border-[3px]',
          '[&::-webkit-scrollbar-thumb]:border-transparent',
          '[&::-webkit-scrollbar-thumb]:bg-clip-content',
          '[&::-webkit-scrollbar-thumb]:bg-[color-mix(in_srgb,var(--color-g-0)_25%,transparent)]',
        )}
      >
        <p className="wrap-break-word text-justify font-body-s text-g-80">
          {feedback}
        </p>
      </div>
    </Card>
  );
};

export default ResultCard;
