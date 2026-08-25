'use client';

import { notFound } from 'next/navigation';

import GroupActionModal from '../GroupActionModal/GroupActionModal';
import GroupForm from '../GroupForm/GroupForm';
import { useGroupEdit } from '../hooks/useGroupEdit';
import { useSuspenseGroupListQuery } from '../queries/useGroupListQuery';

interface GroupEditFormProps {
  groupId: number;
}

const GroupEditForm = ({ groupId }: GroupEditFormProps) => {
  // 목록은 그룹 화면에서 이미 받아둔 캐시라 대개 요청 없이 채워진다
  const { data: groups } = useSuspenseGroupListQuery();
  const group = groups.find((item) => item.id === groupId);

  if (!group) notFound();
  const {
    name,
    setName,
    imagePreview,
    isPending,
    handleImageChange,
    handleSubmit,
    isSuccessModalOpen,
    handleCloseSuccessModal,
  } = useGroupEdit({
    groupId,
    initialName: group.name,
    initialImage: group.image,
  });

  return (
    <>
      <GroupForm
        name={name}
        onNameChange={setName}
        imagePreview={imagePreview}
        onImageChange={handleImageChange}
        onSubmit={handleSubmit}
        submitLabel={isPending ? '수정 중...' : '수정 완료하기'}
        isPending={isPending}
      />

      <GroupActionModal
        isOpen={isSuccessModalOpen}
        title="그룹 수정 완료"
        description={`${group.name}의 그룹 수정이 완료되었습니다`}
        confirmLabel="완료"
        onConfirm={handleCloseSuccessModal}
        onClose={handleCloseSuccessModal}
      />
    </>
  );
};

export default GroupEditForm;
