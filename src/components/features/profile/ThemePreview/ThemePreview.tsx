'use client';

import Image from 'next/image';

import { useUserDetailQuery } from '@/src/components/features/users/queries/useUserDetailQuery';
import { getCharacterAsset } from '@/src/lib/helpers/getCharacterAsset';

const ThemePreview = () => {
  const { data } = useUserDetailQuery();
  const characterAsset = getCharacterAsset(data?.category);

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
