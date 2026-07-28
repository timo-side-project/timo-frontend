import Image from 'next/image';

import Button from '@/src/components/ui/Button/Button';
import Modal from '@/src/components/ui/Modal/Modal';

interface ThemeApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  imageUrl: string;
  name: string;
  decorationImageUrl?: string | null;
}

const ThemeApplyModal = ({
  isOpen,
  onClose,
  onConfirm,
  imageUrl,
  name,
  decorationImageUrl,
}: ThemeApplyModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center gap-5">
        <div className="relative flex h-48.75 w-full items-center justify-center rounded-2xl bg-g-600">
          <Image src={imageUrl} alt={name} width={170} height={170} />
          {decorationImageUrl && (
            <Image
              src={decorationImageUrl}
              alt=""
              width={40}
              height={40}
              className="absolute right-1/4 bottom-6"
            />
          )}
        </div>
        <div className="flex flex-col items-center gap-3 text-center">
          <p className="font-button-l text-primary">
            나의 캐릭터 테마 적용 완료
          </p>
          <p className="font-body-s text-g-60">
            나의 캐릭터 테마 적용이 완료되었습니다
          </p>
        </div>
        <Button label="보러가기" onClick={onConfirm} />
      </div>
    </Modal>
  );
};

export default ThemeApplyModal;
