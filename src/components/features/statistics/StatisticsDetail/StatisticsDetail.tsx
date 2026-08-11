'use client';

import { Suspense, useState } from 'react';

import AvatarButton from '@/src/components/ui/AvatarButton/AvatarButton';
import Skeleton from '@/src/components/ui/Skeleton/Skeleton';
import { useDialIndicator } from '@/src/hooks/useDialIndicator';
import { CATEGORY_CHARACTER_MAP } from '@/src/lib/constants/character';

import GraphSection from '../GraphSection/GraphSection';
import { useAllStatisticsQuery } from '../queries/useAllStatisticsQuery';

const StatisticsDetail = () => {
  const { data } = useAllStatisticsQuery();

  const [selectedCharacter, setSelectedCharacter] = useState(
    data.categories[0],
  );

  const { scrollRef, indicatorRef, registerItemRef, handleSelect } =
    useDialIndicator({
      itemIds: data.categories.map((item) => item.category),
      selectedId: selectedCharacter?.category,
      onSelect: (category) => {
        const next = data.categories.find((item) => item.category === category);
        if (next) setSelectedCharacter(next);
      },
    });

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
    <div className="flex flex-col flex-1">
      <div className="relative">
        <div
          ref={scrollRef}
          className="flex h-28 items-start pt-4 overflow-x-auto overflow-y-hidden scrollbar-hidden snap-x snap-mandatory"
        >
          {data.categories.map((item, idx) => {
            const { profileSrc } = CATEGORY_CHARACTER_MAP[item.category];
            return (
              <div
                key={item.category}
                ref={registerItemRef(item.category)}
                className="shrink-0 snap-start snap-always"
              >
                <AvatarButton
                  src={profileSrc}
                  label={item.character}
                  isSelected={selectedCharacter.category === item.category}
                  onClick={() => handleSelect(item.category)}
                  preload={idx < 5}
                />
              </div>
            );
          })}
        </div>

        <div
          ref={indicatorRef}
          aria-hidden
          className="invisible absolute -bottom-2 h-0 w-0 border-x-13 border-b-18 border-x-transparent border-b-g-500"
        />
      </div>

      <div className="bg-g-500 -mx-7.5 px-7.5 py-6 mt-2 flex-1">
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
