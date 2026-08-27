import ErrorState from '@/src/components/ui/ErrorState/ErrorState';
import Skeleton from '@/src/components/ui/Skeleton/Skeleton';

import type { SortValue } from '../../constants/groupSort';
import type { GroupType } from '../../constants/groupType';
import type { GroupFriendItem } from '../../queries/useGroupFriendListQuery';
import { useGroupFriendListQuery } from '../../queries/useGroupFriendListQuery';
import RankingEmptyState from '../RankingEmptyState/RankingEmptyState';
import RankingItem from '../RankingItem/RankingItem';

interface RankingListProps {
  groupId: number;
  sort: SortValue;
  activeTab: GroupType;
  onSelect: (item: GroupFriendItem) => void;
}

const RankingList = ({
  groupId,
  sort,
  activeTab,
  onSelect,
}: RankingListProps) => {
  const { data, isError, isPending } = useGroupFriendListQuery({
    groupId,
    sort,
  });

  if (isError)
    return (
      <ErrorState
        title="친구 리스트를 불러오지 못했어요."
        description="잠시 후 다시 시도해주세요."
      />
    );

  if (isPending) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-15" />
        <Skeleton className="h-15" />
        <Skeleton className="h-15" />
        <Skeleton className="h-15" />
        <Skeleton className="h-15" />
      </div>
    );
  }

  if (data.length === 0) {
    return <RankingEmptyState activeTab={activeTab} />;
  }

  return (
    <ul className="space-y-8">
      {data.map((item, index) => (
        <RankingItem
          isExistImg={activeTab === 'FRIEND'}
          key={item.userId}
          nickname={item.nickname}
          answerText={item.answerText ?? ''}
          streakDays={item.streakDays}
          ranking={index + 1}
          userCategory={item.userCategory}
          onClick={() => onSelect(item)}
        />
      ))}
    </ul>
  );
};

export default RankingList;
