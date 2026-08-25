import { type ChangeEvent, useEffect, useState } from 'react';

import { useToast } from '@/src/hooks/useToast';

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

interface UseImagePickerParams {
  /** 이미 올려둔 이미지 주소. 수정 화면처럼 기존 값을 보여줄 때 넘긴다 */
  initialPreview?: string | null;
}

/** 이미지 파일 선택과 미리보기를 다룬다 */
export const useImagePicker = ({
  initialPreview = null,
}: UseImagePickerParams = {}) => {
  const { showToast } = useToast();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialPreview,
  );

  useEffect(() => {
    return () => {
      // 새로 고른 파일의 임시 주소만 해제 대상이다. 서버 이미지 주소는 아니다
      if (imageFile && imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imageFile, imagePreview]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_IMAGE_SIZE) {
      showToast({ message: '10MB 이하의 이미지만 업로드할 수 있어요.' });
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  return { imageFile, imagePreview, handleImageChange };
};
