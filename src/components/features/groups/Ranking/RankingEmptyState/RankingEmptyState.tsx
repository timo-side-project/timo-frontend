import type { GroupType } from '../../constants/groupType';

interface RankingEmptyStateProps {
  activeTab: GroupType;
}

const RankingEmptyState = ({ activeTab }: RankingEmptyStateProps) => {
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
};

export default RankingEmptyState;
