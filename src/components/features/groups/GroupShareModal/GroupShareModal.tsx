'use client';

import Button from '@/src/components/ui/Button/Button';
import Modal from '@/src/components/ui/Modal/Modal';
import { useToast } from '@/src/hooks/useToast';

interface GroupShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupCode?: string;
}

const GroupShareModal = ({
  isOpen,
  onClose,
  groupCode,
}: GroupShareModalProps) => {
  const { showToast } = useToast();

  const handleShare = async () => {
    if (!groupCode) return;

    const url = `${window.location.origin}/groups?join=friend&code=${groupCode}`;

    if (navigator.share) {
      try {
        await navigator.share({ title: 'TIMO 그룹 초대', url });
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') return;
        showToast({ message: '공유에 실패했어요.' });
      }
    } else if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(url);
        showToast({ message: '초대 링크가 복사되었어요.' });
      } catch {
        showToast({ message: '초대 링크 복사에 실패했어요.' });
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col gap-6">
        <div className="text-center">
          <h3 className="font-button-l text-primary">코드 생성 완료</h3>
          <p className="mt-3 font-body-s text-g-60">
            친구코드 생성이 완료되었습니다.
          </p>
          <p className="pt-5 font-body-s text-g-20">{groupCode}</p>
        </div>
        <div className="flex flex-col gap-4">
          <Button
            label="공유하기"
            onClick={handleShare}
            variant="secondary"
            size="s"
            className="bg-transparent"
          />
          <Button label="완료" onClick={onClose} size="s" />
        </div>
      </div>
    </Modal>
  );
};

export default GroupShareModal;
