'use client';

import { useDialIndicator } from '@/src/hooks/useDialIndicator';

import type { GroupType } from '../constants/groupType';
import GroupListItem from '../GroupListItem/GroupListItem';

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
  onLongPress?: (id: number) => void;
}

const GroupList = ({
  groups,
  selectedId,
  onSelect,
  onLongPress,
}: GroupListProps) => {
  const { scrollRef, indicatorRef, registerItemRef, handleSelect } =
    useDialIndicator({
      itemIds: groups.map((group) => group.id),
      selectedId,
      onSelect,
    });

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        className="flex h-32 items-start pt-4 gap-2 overflow-x-auto overflow-y-hidden scrollbar-hidden snap-x snap-mandatory"
      >
        {groups.map((item, idx) => (
          <div
            key={item.id}
            ref={registerItemRef(item.id)}
            className="shrink-0 snap-start snap-always"
          >
            <GroupListItem
              id={item.id}
              name={item.name}
              image={item.image}
              isSelected={selectedId === item.id}
              preload={idx < 5}
              onSelect={handleSelect}
              onLongPress={(id) => onLongPress?.(id)}
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
