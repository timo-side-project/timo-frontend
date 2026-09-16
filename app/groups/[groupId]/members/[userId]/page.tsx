import { notFound } from 'next/navigation';

import FriendReflectionContent from '@/src/components/features/groups/FriendReflection/FriendReflectionContent/FriendReflectionContent';
import FriendReflectionHeader from '@/src/components/features/groups/FriendReflection/FriendReflectionHeader/FriendReflectionHeader';
import BottomNavBar from '@/src/components/layout/BottomNavBar/BottomNavBar';

interface PageProps {
  params: Promise<{
    groupId: string;
    userId: string;
  }>;
}

const isPositiveInteger = (value: string) => /^[1-9]\d*$/.test(value);

const GroupFriendReflectionPage = async ({ params }: PageProps) => {
  const { groupId, userId } = await params;

  if (!isPositiveInteger(groupId) || !isPositiveInteger(userId)) {
    notFound();
  }

  return (
    <div className="space-y-10 pb-20">
      <FriendReflectionHeader />
      <FriendReflectionContent groupId={+groupId} userId={+userId} />
      <BottomNavBar />
    </div>
  );
};

export default GroupFriendReflectionPage;
