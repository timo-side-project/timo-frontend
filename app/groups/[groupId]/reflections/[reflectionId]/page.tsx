import FriendReflectionDetail from '@/src/components/features/groups/FriendReflectionDetail/FriendReflectionDetail';
import FriendReflectionHeader from '@/src/components/features/groups/FriendReflectionHeader/FriendReflectionHeader';
import BottomNavBar from '@/src/components/layout/BottomNavBar/BottomNavBar';

interface PageProps {
  params: Promise<{
    groupId: string;
    reflectionId: string;
  }>;
}

const GroupFriendReflectionPage = async ({ params }: PageProps) => {
  const { groupId, reflectionId } = await params;

  return (
    <div className="space-y-10 pb-20">
      <FriendReflectionHeader />
      <FriendReflectionDetail groupId={+groupId} reflectionId={+reflectionId} />
      <BottomNavBar />
    </div>
  );
};

export default GroupFriendReflectionPage;
