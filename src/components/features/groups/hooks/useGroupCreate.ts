import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { useImagePicker } from '@/src/hooks/useImagePicker';
import { useToast } from '@/src/hooks/useToast';

import type { GroupType } from '../constants/groupType';
import {
  type CreateGroupResponse,
  useCreateGroupMutation,
} from '../queries/useCreateGroupMutation';
import { useUploadImageMutation } from '../queries/useUploadImageMutation';

export const useGroupCreate = (type: GroupType) => {
  const router = useRouter();
  const { showToast } = useToast();
  const { mutateAsync: createGroup, isPending: isCreating } =
    useCreateGroupMutation();
  const { mutateAsync: uploadImage, isPending: isUploading } =
    useUploadImageMutation();
  const isPending = isCreating || isUploading;
  const [name, setName] = useState('');
  const { imageFile, imagePreview, handleImageChange } = useImagePicker();
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [createdGroup, setCreatedGroup] = useState<CreateGroupResponse | null>(
    null,
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isPending) return;
    const trimmed = name.trim();
    if (!trimmed) return;

    try {
      const image = imageFile ? await uploadImage(imageFile) : null;
      const result = await createGroup({ name: trimmed, type, image });
      setCreatedGroup(result);
      setIsSuccessModalOpen(true);
    } catch {
      showToast({ message: '그룹 생성에 실패했어요.' });
    }
  };

  const handleCloseSuccessModal = () => {
    setIsSuccessModalOpen(false);
    router.push('/groups');
  };

  return {
    name,
    setName,
    imagePreview,
    isPending,
    handleImageChange,
    handleSubmit,
    isSuccessModalOpen,
    handleCloseSuccessModal,
    createdGroup,
  };
};
