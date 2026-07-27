'use client';

import Image from 'next/image';

import Skeleton from '@/src/components/ui/Skeleton/Skeleton';
import type { Category } from '@/src/lib/constants/character';
import { cn } from '@/src/lib/helpers/cn';
import {
  getCharacterAsset,
  isCharacterCategory,
} from '@/src/lib/helpers/getCharacterAsset';

import { useUserDetailQuery } from '../../users/queries/useUserDetailQuery';

const CATEGORY_LABEL_MAP: Record<Category, string> = {
  PAST_NEGATIVE: '과거부정형',
  PAST_POSITIVE: '과거긍정형',
  PRESENT_HEDONISTIC: '현재쾌락형',
  PRESENT_FATALISTIC: '현재운명형',
  FUTURE: '미래지향형',
};

const DECORATION_OFFSET_CLASSES = ['left-0', 'left-5', 'left-10', 'left-15'];

const ProfileSummary = () => {
  const { data, isPending } = useUserDetailQuery();

  if (isPending) {
    return (
      <div className="flex flex-col items-center">
        <div className="-mx-7.5 -mt-14 flex self-stretch justify-center bg-g-600 px-7.5 pt-16 pb-4">
          <Skeleton
            className="h-37.5 w-37.5 rounded-2xl"
            ariaLabel="프로필 캐릭터 로딩 중"
          />
        </div>
        <div className="flex flex-col items-center gap-2 pt-5">
          <Skeleton className="h-5 w-44" ariaLabel="프로필 문구 로딩 중" />
          <Skeleton className="h-5 w-52" ariaLabel="프로필 문구 로딩 중" />
        </div>
      </div>
    );
  }

  const category = data?.category;
  const characterAsset = getCharacterAsset(category);
  const categoryLabel = isCharacterCategory(category)
    ? CATEGORY_LABEL_MAP[category]
    : '현재쾌락형';

  const equippedCustomizations = data?.equippedCustomizations ?? [];
  const themeItem = equippedCustomizations.find(
    (item) => item.type === 'THEME',
  );
  const decorationItems = equippedCustomizations.filter(
    (item) => item.type === 'DECORATION',
  );

  return (
    <div className="flex flex-col items-center">
      <div className="-mx-7.5 -mt-14 flex self-stretch justify-center bg-g-600 px-7.5 pt-16 pb-4">
        {equippedCustomizations.length === 0 ? (
          <Image
            src={characterAsset.src}
            alt={characterAsset.alt}
            width={150}
            height={150}
          />
        ) : (
          <div className="relative h-37.5 w-37.5">
            <Image
              src={themeItem?.image ?? characterAsset.src}
              alt={themeItem?.name ?? characterAsset.alt}
              fill
              sizes="150px"
              className="object-cover"
            />
            {decorationItems.map((item, index) => (
              <Image
                key={item.id}
                src={item.imageWithoutBackground}
                alt={item.name}
                width={48}
                height={48}
                className={cn(
                  'absolute bottom-0',
                  DECORATION_OFFSET_CLASSES[
                    Math.min(index, DECORATION_OFFSET_CLASSES.length - 1)
                  ],
                )}
              />
            ))}
          </div>
        )}
      </div>
      <div className="pt-4 text-center font-body-s">
        <p>
          {data?.name ?? '사용자'}님은{' '}
          <span className="font-bold">
            <span className={characterAsset.color}>{categoryLabel}</span>이에요.
          </span>
        </p>
        <p>
          <span className={`${characterAsset.color} font-bold`}>
            {characterAsset.name}
          </span>
          와 함께 시간을 기록하고 있어요!
        </p>
      </div>
    </div>
  );
};

export default ProfileSummary;
