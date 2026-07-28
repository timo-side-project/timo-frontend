'use client';

import { useRouter } from 'next/navigation';

import PageHeader from '@/src/components/layout/PageHeader/PageHeader';
import Icon from '@/src/components/ui/Icon/Icon';
import { goBackOrHome } from '@/src/lib/helpers/navigation';

interface ThemeHeaderProps {
  onSave: () => void;
}

const ThemeHeader = ({ onSave }: ThemeHeaderProps) => {
  const router = useRouter();

  return (
    <PageHeader
      title="테마 선택하기"
      leftIcon={<Icon name="chevronLeft" size={28} alt="back" />}
      onLeftClick={() => goBackOrHome(router)}
      rightIcon={<Icon name="saveTheme" alt="save" size={20} />}
      onRightClick={onSave}
    />
  );
};

export default ThemeHeader;
