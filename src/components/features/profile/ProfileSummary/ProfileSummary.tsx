'use client';

import Image from 'next/image';

import Skeleton from '@/src/components/ui/Skeleton/Skeleton';
import type { Category } from '@/src/lib/constants/character';
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

const ProfileSummary = () => {
  const { data, isPending } = useUserDetailQuery();

  if (isPending) {
    return (
      <div className="flex flex-col items-center">
        <div className="w-screen mx-[calc(50%-50vw)] -mt-14 flex justify-center bg-g-600 pt-16 pb-7">
          <Skeleton
            className="h-37 w-37 rounded-2xl"
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

  return (
    <div className="flex flex-col items-center">
      <div className="w-screen mx-[calc(50%-50vw)] -mt-14 flex justify-center bg-g-600 pt-16 py-4">
        <Image
          src={characterAsset.src}
          alt={characterAsset.alt}
          width={150}
          height={150}
        />
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
