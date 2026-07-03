import Button from '@/src/components/ui/Button/Button';
import Modal from '@/src/components/ui/Modal/Modal';

import { useFriendGroupJoin } from '../../hooks/useFriendGroupJoin';

interface FriendGroupJoinProps {
  initialCode?: string;
}

const FriendGroupJoin = ({ initialCode }: FriendGroupJoinProps) => {
  const {
    groupCode,
    errorMessage,
    isSubmitDisabled,
    handleClose,
    handleChange,
    handleSubmit,
  } = useFriendGroupJoin(initialCode);

  return (
    <Modal isOpen onClose={handleClose}>
      <article className="space-y-6">
        <section className="text-center space-y-2">
          <p className="font-button-l text-primary">친구 코드 입력</p>
          <p className="font-body-s text-g-60">친구 코드를 받아 입력해주세요</p>
        </section>

        <div className="space-y-1">
          <input
            placeholder="코드를 입력하세요"
            className="appearance-none text-center w-full outline-none text-g-20 font-button-l"
            value={groupCode}
            onChange={(event) => handleChange(event.target.value)}
          />
          {errorMessage && (
            <p className="text-center font-body-s text-red-500">
              {errorMessage}
            </p>
          )}
        </div>
        <Button
          label="입력하기"
          aria-label="입력하기"
          className="font-button-s"
          disabled={isSubmitDisabled}
          onClick={handleSubmit}
        />
      </article>
    </Modal>
  );
};

export default FriendGroupJoin;
