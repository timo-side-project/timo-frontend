'use client';

import { useRouter } from 'next/navigation';

import PageHeader from '@/src/components/layout/PageHeader/PageHeader';
import Icon from '@/src/components/ui/Icon/Icon';
import { goBackOrHome } from '@/src/lib/helpers/navigation';

interface PrivacyToggle {
  isPrivate: boolean;
  onToggle: () => void;
  isToggling: boolean;
}

interface FriendReflectionHeaderProps {
  privacyToggle?: PrivacyToggle;
}

export default function FriendReflectionHeader({
  privacyToggle,
}: FriendReflectionHeaderProps) {
  const router = useRouter();

  return (
    <PageHeader
      title={privacyToggle ? '나의 회고' : '친구 회고'}
      leftIcon={<Icon name="chevronLeft" size={25} />}
      onLeftClick={() => goBackOrHome(router)}
      rightIcon={
        privacyToggle ? (
          <Icon
            name={privacyToggle.isPrivate ? 'lock' : 'unlock'}
            size={25}
            alt={privacyToggle.isPrivate ? '비공개' : '공개'}
          />
        ) : undefined
      }
      onRightClick={
        privacyToggle && !privacyToggle.isToggling
          ? privacyToggle.onToggle
          : undefined
      }
      className="-mx-7.5 px-5"
    />
  );
}
