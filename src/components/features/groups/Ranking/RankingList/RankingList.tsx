import ErrorState from '@/src/components/ui/ErrorState/ErrorState';
import Skeleton from '@/src/components/ui/Skeleton/Skeleton';
import { useToast } from '@/src/hooks/useToast';

import type { SortValue } from '../../constants/groupSort';
import type { GroupType } from '../../constants/groupType';
import type { GroupFriendItem } from '../../queries/useGroupFriendListQuery';
import { useGroupFriendListQuery } from '../../queries/useGroupFriendListQuery';
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
  const { showToast } = useToast();

  const handleSelect = (item: GroupFriendItem) => {
    if (!item.answerText) {
      showToast({
        message: '아직 회고를 작성하지 않았어요.',
        variant: 'alert',
      });
      return;
    }
    onSelect(item);
  };

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
    return (
      <section className="flex h-28 flex-col items-center justify-center gap-1">
        <p className="font-body-s text-g-0">아직 함께하는 멤버가 없어요</p>
        {activeTab === 'FRIEND' && (
          <p className="font-caption-n text-g-80">
            친구를 초대하고 함께 기록해보세요
          </p>
        )}
      </section>
    );
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
          onClick={() => handleSelect(item)}
        />
      ))}
    </ul>
  );
};

export default RankingList;
