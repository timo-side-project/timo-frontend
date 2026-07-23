'use client';

import Image from 'next/image';

import Skeleton from '@/src/components/ui/Skeleton/Skeleton';

interface ThemePreviewProps {
  imageUrl: string | null;
  name: string;
  isPending: boolean;
  decorationImageUrl?: string | null;
  decorationName?: string;
}

const ThemePreview = ({
  imageUrl,
  name,
  isPending,
  decorationImageUrl,
  decorationName,
}: ThemePreviewProps) => {
  if (isPending || !imageUrl) {
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
    <div className="flex justify-center">
      <div className="relative h-50 w-50">
        <Image
          src={imageUrl}
          alt={name}
          fill
          sizes="200px"
          className="object-cover"
        />
        {decorationImageUrl && (
          <Image
            src={decorationImageUrl}
            alt={decorationName ?? ''}
            width={56}
            height={56}
            className="absolute right-1 bottom-1"
          />
        )}
      </div>
    </div>
  );
};

export default ThemePreview;
