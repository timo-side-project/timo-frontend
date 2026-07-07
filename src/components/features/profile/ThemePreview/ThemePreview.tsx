'use client';

import Image from 'next/image';

import { useUserDetailQuery } from '@/src/components/features/users/queries/useUserDetailQuery';
import Skeleton from '@/src/components/ui/Skeleton/Skeleton';
import { getCharacterAsset } from '@/src/lib/helpers/getCharacterAsset';

const ThemePreview = () => {
  const { data, isPending } = useUserDetailQuery();
  const characterAsset = getCharacterAsset(data?.category);

  if (isPending) {
    return (
      <div className="flex justify-center py-9">
        <Skeleton
          className="h-43.25 w-43.25 rounded-2xl"
          ariaLabel="캐릭터 로딩 중"
        />
      </div>
    );
  }

  return (
    <div className="flex justify-center py-9">
      <Image
        src={characterAsset.src}
        alt={characterAsset.alt}
        width={173}
        height={173}
      />
    </div>
  );
};

export default ThemePreview;
