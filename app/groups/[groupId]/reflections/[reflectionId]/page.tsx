import { notFound } from 'next/navigation';

import FriendReflectionDetail from '@/src/components/features/groups/FriendReflection/FriendReflectionDetail/FriendReflectionDetail';
import BottomNavBar from '@/src/components/layout/BottomNavBar/BottomNavBar';

interface PageProps {
  params: Promise<{
    groupId: string;
    reflectionId: string;
  }>;
}

const isPositiveInteger = (value: string) => /^[1-9]\d*$/.test(value);

const GroupFriendReflectionPage = async ({ params }: PageProps) => {
  const { groupId, reflectionId } = await params;

  if (!isPositiveInteger(groupId) || !isPositiveInteger(reflectionId)) {
    notFound();
  }

  return (
    <div className="space-y-10 pb-20">
      <FriendReflectionDetail
        key={reflectionId}
        groupId={+groupId}
        reflectionId={+reflectionId}
      />
      <BottomNavBar />
    </div>
  );
};

export default GroupFriendReflectionPage;
