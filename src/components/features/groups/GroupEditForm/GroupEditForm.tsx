'use client';

import GroupActionModal from '../GroupActionModal/GroupActionModal';
import GroupForm from '../GroupForm/GroupForm';
import { useGroupEdit } from '../hooks/useGroupEdit';
import { useSuspenseGroupDetailQuery } from '../queries/useGroupDetailQuery';

interface GroupEditFormProps {
  groupId: number;
}

const GroupEditForm = ({ groupId }: GroupEditFormProps) => {
  const { data: group } = useSuspenseGroupDetailQuery(groupId);
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
