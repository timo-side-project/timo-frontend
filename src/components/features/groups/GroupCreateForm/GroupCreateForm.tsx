'use client';

import type { GroupType } from '../constants/groupType';
import GroupForm from '../GroupForm/GroupForm';
import GroupShareModal from '../GroupShareModal/GroupShareModal';
import { useGroupCreate } from '../hooks/useGroupCreate';

interface GroupCreateFormProps {
  type: GroupType;
}

const GroupCreateForm = ({ type }: GroupCreateFormProps) => {
  const {
    name,
    setName,
    imagePreview,
    isPending,
    handleImageChange,
    handleSubmit,
    isSuccessModalOpen,
    handleCloseSuccessModal,
    createdGroup,
  } = useGroupCreate(type);

  return (
    <>
      <GroupForm
        name={name}
        onNameChange={setName}
        imagePreview={imagePreview}
        onImageChange={handleImageChange}
        onSubmit={handleSubmit}
        submitLabel={isPending ? '생성 중...' : '그룹 생성하기'}
        isPending={isPending}
      />

      <GroupShareModal
        isOpen={isSuccessModalOpen}
        onClose={handleCloseSuccessModal}
        groupCode={createdGroup?.code}
      />
    </>
  );
};

export default GroupCreateForm;
