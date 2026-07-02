'use client';

import { useState } from 'react';

import SortSelect from '@/src/components/ui/SortSelect/SortSelect';

import { SORT_OPTIONS } from '../../constants/groupSort';
import { type GroupType, groupType } from '../../constants/groupType';
import type { GroupFriendItem } from '../../queries/useGroupFriendListQuery';
import RankingList from '../RankingList/RankingList';

interface RankingSectionProps {
  activeTab?: GroupType;
  groupId: number;
  onSelect: (item: GroupFriendItem) => void;
}

const RankingSection = ({
  activeTab = 'FRIEND',
  groupId,
  onSelect,
}: RankingSectionProps) => {
  const [sort, setSort] = useState(SORT_OPTIONS[0].value);

  return (
    <section className="flex flex-col h-full gap-6">
      <div className="flex items-center justify-between">
        <p className="font-heading-h4 text-g-0">
          {activeTab === 'FRIEND' ? groupType.FRIEND : groupType.CHARACTER}
        </p>

        <SortSelect options={SORT_OPTIONS} value={sort} onChange={setSort} />
      </div>

      <div className="flex-1 overflow-y-auto pb-24">
        <RankingList
          groupId={groupId}
          sort={sort}
          activeTab={activeTab}
          onSelect={onSelect}
        />
      </div>
    </section>
  );
};

export default RankingSection;
