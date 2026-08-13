'use client';

import AvatarButton from '@/src/components/ui/AvatarButton/AvatarButton';
import { useLongPress } from '@/src/hooks/useLongPress';

interface GroupListItemProps {
  id: number;
  name: string;
  image: string | null;
  isSelected: boolean;
  preload?: boolean;
  onSelect: (id: number) => void;
  onLongPress: (id: number) => void;
}

const GroupListItem = ({
  id,
  name,
  image,
  isSelected,
  preload = false,
  onSelect,
  onLongPress,
}: GroupListItemProps) => {
  const longPressHandlers = useLongPress({
    onLongPress: () => onLongPress(id),
  });

  return (
    <AvatarButton
      src={image || '/images/default-group.svg'}
      label={name}
      isSelected={isSelected}
      onClick={() => onSelect(id)}
      preload={preload}
      // 길게 누를 때 텍스트 선택과 iOS 이미지 미리보기가 뜨지 않도록 막는다
      className="select-none [-webkit-touch-callout:none]"
      {...longPressHandlers}
    />
  );
};

export default GroupListItem;
