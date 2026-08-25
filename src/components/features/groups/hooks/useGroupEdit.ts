import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { useImagePicker } from '@/src/hooks/useImagePicker';
import { useToast } from '@/src/hooks/useToast';

import { useUpdateGroupMutation } from '../queries/useUpdateGroupMutation';
import { useUploadImageMutation } from '../queries/useUploadImageMutation';

interface UseGroupEditParams {
  groupId: number;
  initialName: string;
  initialImage: string | null;
}

export const useGroupEdit = ({
  groupId,
  initialName,
  initialImage,
}: UseGroupEditParams) => {
  const router = useRouter();
  const { showToast } = useToast();
  const { mutateAsync: updateGroup, isPending: isUpdating } =
    useUpdateGroupMutation(groupId);
  const { mutateAsync: uploadImage, isPending: isUploading } =
    useUploadImageMutation();
  const isPending = isUpdating || isUploading;
  const [name, setName] = useState(initialName);
  const { imageFile, imagePreview, handleImageChange } = useImagePicker({
    initialPreview: initialImage,
  });
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isPending) return;
    const trimmed = name.trim();
    if (!trimmed) return;

    try {
      // 이미지를 바꾸지 않았다면 필드를 빼서 기존 이미지를 유지한다
      const image = imageFile ? await uploadImage(imageFile) : undefined;
      await updateGroup(image ? { name: trimmed, image } : { name: trimmed });
      setIsSuccessModalOpen(true);
    } catch {
      showToast({ message: '그룹 수정에 실패했어요.' });
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
  };
};
