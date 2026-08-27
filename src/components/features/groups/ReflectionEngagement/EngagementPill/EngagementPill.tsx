import Icon from '@/src/components/ui/Icon/Icon';
import type { IconNameType } from '@/src/components/ui/Icon/Icon.types';

interface EngagementPillProps {
  count: number;
  filledIcon: IconNameType;
  emptyIcon: IconNameType;
  alt: string;
  onClick: () => void;
  disabled?: boolean;
}

const EngagementPill = ({
  count,
  filledIcon,
  emptyIcon,
  alt,
  onClick,
  disabled = false,
}: EngagementPillProps) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className="flex items-center gap-1.25 rounded-2xl bg-g-400 px-2.5 py-1.25"
  >
    <Icon name={count > 0 ? filledIcon : emptyIcon} size={28} alt={alt} />
    {count > 0 && <span className="font-body-base text-primary">{count}</span>}
  </button>
);

export default EngagementPill;
