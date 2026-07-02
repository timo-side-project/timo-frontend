'use client';

import AvatarButton from '@/src/components/ui/AvatarButton/AvatarButton';

import type { GroupType } from '../constants/groupType';

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
  return (
    <div className="flex h-28 items-start pt-4 gap-4 overflow-x-auto overflow-y-hidden scrollbar-hidden">
      {groups.map((item, idx) => (
        <AvatarButton
          key={item.id}
          src={item.image || '/images/default-group.svg'}
          label={item.name}
          isSelected={selectedId === item.id}
          onClick={() => onSelect?.(item.id)}
          preload={idx < 5}
        />
      ))}
    </div>
  );
};

export default GroupList;
