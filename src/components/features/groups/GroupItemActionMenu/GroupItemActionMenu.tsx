'use client';

import { useEffect } from 'react';

import Icon from '@/src/components/ui/Icon/Icon';

/** w-44와 같은 값. 화면 밖으로 나가지 않도록 좌표를 계산할 때 쓴다 */
const MENU_WIDTH = 176;
/** 썸네일·화면 가장자리와 띄울 간격 */
const GAP = 8;

interface GroupItemActionMenuProps {
  /** 길게 누른 썸네일의 화면상 위치 */
  anchorRect: DOMRect;
  isOwner: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onLeave: () => void;
  onClose: () => void;
}

const GroupItemActionMenu = ({
  anchorRect,
  isOwner,
  onEdit,
  onDelete,
  onLeave,
  onClose,
}: GroupItemActionMenuProps) => {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleEscape);

    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // 썸네일 왼쪽에 맞추되 화면 밖으로 밀려나지 않게 가둔다
  const left = Math.min(
    Math.max(anchorRect.left, GAP),
    window.innerWidth - MENU_WIDTH - GAP,
  );

  return (
    <>
      <button
        type="button"
        aria-label="메뉴 닫기"
        onClick={onClose}
        className="fixed inset-0 z-40"
      />
      <div
        role="menu"
        style={{ top: anchorRect.bottom + GAP, left }}
        className="fixed z-50 w-44 rounded-2xl bg-g-500 py-1 shadow-lg"
      >
        <button
          type="button"
          role="menuitem"
          onClick={isOwner ? onDelete : onLeave}
          className="block w-full px-4 py-3 text-left font-button-s text-g-40 hover:bg-g-400/20"
        >
          {isOwner ? '그룹 삭제하기' : '그룹 나가기'}
        </button>

        <button
          type="button"
          role="menuitem"
          onClick={onEdit}
          className="flex w-full items-center justify-between px-4 py-3 font-button-s text-g-40 hover:bg-g-400/20"
        >
          그룹 수정하기
          <Icon
            name="chevronLeft"
            size={16}
            alt=""
            decorative
            className="rotate-180"
          />
        </button>
      </div>
    </>
  );
};

export default GroupItemActionMenu;
