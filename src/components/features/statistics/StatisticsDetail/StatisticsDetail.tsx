'use client';

import { Suspense, useState } from 'react';

import AvatarButton from '@/src/components/ui/AvatarButton/AvatarButton';
import Skeleton from '@/src/components/ui/Skeleton/Skeleton';
import { CATEGORY_CHARACTER_MAP } from '@/src/lib/constants/character';

import GraphSection from '../GraphSection/GraphSection';
import { useAllStatisticsQuery } from '../queries/useAllStatisticsQuery';

const StatisticsDetail = () => {
  const { data } = useAllStatisticsQuery();

  const [selectedCharacter, setSelectedCharacter] = useState(
    data.categories[0],
  );

  if (!selectedCharacter) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 py-20">
        <p className="font-caption-n text-g-100">
          표시할 통계 데이터가 없습니다.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 gap-1">
      <div className="flex h-28 items-start pt-4 gap-4 overflow-x-auto overflow-y-hidden scrollbar-hidden">
        {data.categories.map((item) => {
          const { profileSrc } = CATEGORY_CHARACTER_MAP[item.category];
          return (
            <AvatarButton
              key={item.category}
              src={profileSrc}
              label={item.character}
              isSelected={selectedCharacter.category === item.category}
              onClick={() => setSelectedCharacter(item)}
            />
          );
        })}
      </div>

      <div className="bg-g-500 -mx-7.5 px-7.5 py-6 flex-1">
        <Suspense fallback={<Skeleton />}>
          <GraphSection
            category={selectedCharacter.category}
            character={selectedCharacter.character}
          />
        </Suspense>
      </div>
    </div>
  );
};

export default StatisticsDetail;
