'use client';

import AvatarButton from '@/src/components/ui/AvatarButton/AvatarButton';

import type { GroupType } from '../constants/groupType';
import { useGroupDialIndicator } from '../hooks/useGroupDialIndicator';

interface GroupItem {
  id: number;
  name: string;
  type: GroupType;
  image: string | null;
}

interface GroupListProps {
  groups: GroupItem[];
  selectedId?: number;
  onSelect?: (id: number) => void;
}

const GroupList = ({ groups, selectedId, onSelect }: GroupListProps) => {
  const { scrollRef, indicatorRef, registerItemRef, handleSelect } =
    useGroupDialIndicator({ groups, selectedId, onSelect });

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        className="flex h-32 items-start pt-4 gap-4 overflow-x-auto overflow-y-hidden scrollbar-hidden snap-x snap-mandatory"
      >
        {groups.map((item, idx) => (
          <div
            key={item.id}
            ref={registerItemRef(item.id)}
            className="shrink-0 snap-start snap-always"
          >
            <AvatarButton
              src={item.image || '/images/default-group.svg'}
              label={item.name}
              isSelected={selectedId === item.id}
              onClick={() => handleSelect(item.id)}
              preload={idx < 5}
            />
          </div>
        ))}
      </div>

      <div
        ref={indicatorRef}
        aria-hidden
        className="invisible absolute -bottom-2 h-0 w-0 border-x-13 border-b-18 border-x-transparent border-b-g-500"
      />
    </div>
  );
};

export default GroupList;
