'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { getObjectParticle } from '@/src/lib/helpers/getObjectParticle';

import GroupActionModal from '../GroupActionModal/GroupActionModal';
import GroupItemActionMenu from '../GroupItemActionMenu/GroupItemActionMenu';
import { useDeleteGroupMutation } from '../queries/useDeleteGroupMutation';
import { useLeaveGroupMutation } from '../queries/useLeaveGroupMutation';

interface GroupItemActionsProps {
  groupId: number;
  groupName: string;
  isOwner: boolean;
  anchorRect: DOMRect;
  onClose: () => void;
}

/** 길게 누른 그룹 하나에 대한 메뉴와 확인 모달을 담당한다 */
const GroupItemActions = ({
  groupId,
  groupName,
  isOwner,
  anchorRect,
  onClose,
}: GroupItemActionsProps) => {
  const router = useRouter();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const { mutate: deleteGroup, isPending: isDeleting } =
    useDeleteGroupMutation(groupId);
  const { mutate: leaveGroup, isPending: isLeaving } =
    useLeaveGroupMutation(groupId);

  const handleConfirm = () => {
    const mutate = isOwner ? deleteGroup : leaveGroup;

    mutate(undefined, { onSuccess: onClose });
  };

  if (isConfirmOpen) {
    return (
      <GroupActionModal
        isOpen
        title={isOwner ? '그룹 삭제하기' : '그룹 나가기'}
        description={`${groupName}${getObjectParticle(groupName)} ${
          isOwner ? '삭제하' : '나가'
        }시겠습니까?`}
        confirmLabel={isOwner ? '삭제하기' : '나가기'}
        cancelLabel="취소하기"
        onConfirm={handleConfirm}
        onClose={onClose}
        isPending={isDeleting || isLeaving}
      />
    );
  }

  return (
    <GroupItemActionMenu
      anchorRect={anchorRect}
      isOwner={isOwner}
      onEdit={() => router.push(`/groups/${groupId}/edit`)}
      onDelete={() => setIsConfirmOpen(true)}
      onLeave={() => setIsConfirmOpen(true)}
      onClose={onClose}
    />
  );
};

export default GroupItemActions;
