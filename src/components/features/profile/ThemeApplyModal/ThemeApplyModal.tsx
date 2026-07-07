import Image from 'next/image';

import { useUserDetailQuery } from '@/src/components/features/users/queries/useUserDetailQuery';
import Button from '@/src/components/ui/Button/Button';
import Modal from '@/src/components/ui/Modal/Modal';
import { getCharacterAsset } from '@/src/lib/helpers/getCharacterAsset';

interface ThemeApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ThemeApplyModal = ({
  isOpen,
  onClose,
  onConfirm,
}: ThemeApplyModalProps) => {
  const { data } = useUserDetailQuery();
  const characterAsset = getCharacterAsset(data?.category);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center gap-5">
        <div className="flex h-48.75 w-full items-center justify-center rounded-2xl bg-g-600">
          <Image
            src={characterAsset.src}
            alt={characterAsset.alt}
            width={150}
            height={150}
          />
        </div>
        <div className="flex flex-col items-center gap-3 text-center">
          <p className="font-button-l text-primary">나의 캐릭터 펫 적용 완료</p>
          <p className="font-body-s text-g-60">
            나의 캐릭터 펫 적용이 완료되었습니다
          </p>
        </div>
        <Button label="보러가기" onClick={onConfirm} />
      </div>
    </Modal>
  );
};

export default ThemeApplyModal;
