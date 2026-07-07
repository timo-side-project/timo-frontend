'use client';

import Image from 'next/image';

import Button from '@/src/components/ui/Button/Button';
import Modal from '@/src/components/ui/Modal/Modal';

interface RewardResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  imageSrc?: string;
  imageAlt?: string;
  onView?: () => void;
  viewLabel?: string;
}

// TODO(#189): 후속 연동 필요
// - imageSrc: 적용 완료 프리뷰 이미지 asset/API 연결
// - onView: 보러가기 라우팅 연결
const RewardResultModal = ({
  isOpen,
  onClose,
  title,
  description,
  imageSrc,
  imageAlt = '',
  onView,
  viewLabel = '보러가기',
}: RewardResultModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col gap-6">
        {imageSrc && (
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-g-600">
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              className="object-cover"
              sizes="(max-width: 440px) 100vw, 440px"
            />
          </div>
        )}

        <div className="text-center">
          <h3 className="font-button-l text-primary">{title}</h3>
          <p className="mt-3 font-body-s text-g-60">{description}</p>
        </div>

        <div className="flex flex-col gap-4">
          <Button label="완료" onClick={onClose} size="s" />
          {onView && (
            <button
              type="button"
              onClick={onView}
              className="font-button-s text-primary underline"
            >
              {viewLabel}
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default RewardResultModal;
