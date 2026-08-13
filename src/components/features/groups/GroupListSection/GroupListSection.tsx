'use client';

import { useEffect, useState } from 'react';

import GroupList from '@/src/components/features/groups/GroupList/GroupList';
import { useSuspenseGroupListQuery } from '@/src/components/features/groups/queries/useGroupListQuery';
import { sortByCategory } from '@/src/lib/helpers/sortByCategory';

import type { GroupType } from '../constants/groupType';
import GroupItemActions from '../GroupItemActions/GroupItemActions';

interface GroupListSectionProps {
  activeTab: GroupType;
  onGroupSelect: (id: number | null) => void;
}

const GroupListSection = ({
  activeTab,
  onGroupSelect,
}: GroupListSectionProps) => {
  const { data: groups } = useSuspenseGroupListQuery();

  const filteredGroups = groups.filter((g) => g.type === activeTab);

  const orderedGroups =
    activeTab === 'CHARACTER' ? sortByCategory(filteredGroups) : filteredGroups;

  const [selectedId, setSelectedId] = useState<number | null>(
    orderedGroups[0]?.id ?? null,
  );
  const [menuTarget, setMenuTarget] = useState<{
    id: number;
    anchorRect: DOMRect;
  } | null>(null);

  const menuGroup = orderedGroups.find((group) => group.id === menuTarget?.id);

  useEffect(() => {
    onGroupSelect(orderedGroups[0]?.id ?? null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelect = (id: number) => {
    setSelectedId(id);
    onGroupSelect(id);
  };

  if (orderedGroups.length === 0) {
    return (
      <section className="flex h-28 flex-col items-center justify-center gap-1">
        <p className="font-body-s text-g-0">아직 참여 중인 그룹이 없어요</p>
        <p className="font-caption-n text-g-80">
          그룹을 만들고 친구들을 초대해보세요
        </p>
      </section>
    );
  }

  return (
    <section>
      <GroupList
        groups={orderedGroups}
        selectedId={selectedId ?? undefined}
        onSelect={handleSelect}
        onLongPress={(id, anchorRect) => setMenuTarget({ id, anchorRect })}
      />

      {menuTarget && menuGroup ? (
        <GroupItemActions
          groupId={menuGroup.id}
          groupName={menuGroup.name}
          isOwner={menuGroup.myRole === 'OWNER'}
          anchorRect={menuTarget.anchorRect}
          onClose={() => setMenuTarget(null)}
        />
      ) : null}
    </section>
  );
};

export default GroupListSection;
