import Image from 'next/image';

import { cn } from '@/src/lib/helpers/cn';

interface AvatarButtonProps {
  src: string;
  label: string;
  isSelected?: boolean;
  onClick?: () => void;
  preload?: boolean;
  sizes?: string;
}

const AvatarButton = ({
  src,
  label,
  isSelected = false,
  onClick,
  preload = false,
  sizes = '55px',
}: AvatarButtonProps) => {
  return (
    <button
      type="button"
      className="flex flex-col items-center gap-2 w-17.5 shrink-0 cursor-pointer"
      aria-pressed={isSelected}
      onClick={onClick}
    >
      <div className="relative w-13.75 h-13.75 rounded-[10px] overflow-hidden shrink-0">
        <Image
          src={src}
          alt={label}
          fill
          className="object-cover"
          sizes={sizes}
          preload={preload}
        />
        {!isSelected && <div className="absolute inset-0 bg-g-900/60" />}
      </div>
      <p
        className={cn(
          'font-caption-n line-clamp-2 text-center',
          isSelected ? 'text-g-0' : 'text-g-80',
        )}
      >
        {label}
      </p>
    </button>
  );
};

export default AvatarButton;
