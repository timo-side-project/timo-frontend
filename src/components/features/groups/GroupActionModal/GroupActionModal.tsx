import Button from '@/src/components/ui/Button/Button';
import Modal from '@/src/components/ui/Modal/Modal';

interface GroupActionModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: () => void;
  onClose: () => void;
  /** 넘기지 않으면 확인 버튼만 있는 안내용 모달이 된다 */
  cancelLabel?: string;
  isPending?: boolean;
}

const GroupActionModal = ({
  isOpen,
  title,
  description,
  confirmLabel,
  onConfirm,
  onClose,
  cancelLabel,
  isPending = false,
}: GroupActionModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-3 text-center">
          <h3 className="font-button-l text-primary">{title}</h3>
          <p className="font-body-s text-g-80">{description}</p>
        </div>

        <div className="flex gap-3">
          <Button
            label={confirmLabel}
            variant="primary"
            size="s"
            onClick={onConfirm}
            disabled={isPending}
            className="h-11"
          />

          {cancelLabel ? (
            <Button
              label={cancelLabel}
              variant="secondary"
              size="s"
              onClick={onClose}
              disabled={isPending}
              className="h-11 bg-g-400"
            />
          ) : null}
        </div>
      </div>
    </Modal>
  );
};

export default GroupActionModal;
