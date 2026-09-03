'use client';

import { useState } from 'react';

import PageHeader from '@/src/components/layout/PageHeader/PageHeader';
import Icon from '@/src/components/ui/Icon/Icon';
import { cn } from '@/src/lib/helpers/cn';

import FriendReflectionContent from '../FriendReflectionContent/FriendReflectionContent';
import type { GroupFriendItem } from '../queries/useGroupFriendListQuery';

interface FriendReflectionPanelProps {
  groupId: number | null;
  friend: GroupFriendItem | null;
  onClose: () => void;
}

const FriendReflectionPanel = ({
  groupId,
  friend,
  onClose,
}: FriendReflectionPanelProps) => {
  const isOpen = friend !== null;
  const [displayFriend, setDisplayFriend] = useState<GroupFriendItem | null>(
    friend,
  );
  const [prevFriend, setPrevFriend] = useState(friend);

  if (prevFriend !== friend) {
    setPrevFriend(friend);
    if (friend !== null) setDisplayFriend(friend);
  }

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 bg-g-700 transition-transform duration-300',
        isOpen ? 'translate-x-0' : 'translate-x-full',
      )}
    >
      <div className="max-w-110 mx-auto h-full px-7.5 overflow-y-auto">
        <div className="space-y-4 pb-20">
          <PageHeader
            title="친구 회고"
            leftIcon={<Icon name="chevronLeft" size={25} />}
            onLeftClick={onClose}
            className="-mx-7.5 px-5"
          />

          {groupId !== null && displayFriend !== null && (
            <FriendReflectionContent
              key={displayFriend.userId}
              groupId={groupId}
              friend={displayFriend}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default FriendReflectionPanel;
