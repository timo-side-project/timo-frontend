'use client';

import { useRouter } from 'next/navigation';

import PageHeader from '@/src/components/layout/PageHeader/PageHeader';
import Icon from '@/src/components/ui/Icon/Icon';
import { goBackOrHome } from '@/src/lib/helpers/navigation';

interface PrivacyToggle {
  isPublic: boolean;
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
      leftAriaLabel="뒤로가기"
      rightIcon={
        privacyToggle ? (
          <Icon
            name={privacyToggle.isPublic ? 'unlock' : 'lock'}
            size={25}
            alt={privacyToggle.isPublic ? '공개' : '비공개'}
          />
        ) : undefined
      }
      onRightClick={
        privacyToggle && !privacyToggle.isToggling
          ? privacyToggle.onToggle
          : undefined
      }
      rightAriaLabel={
        privacyToggle
          ? privacyToggle.isPublic
            ? '회고를 비공개로 전환'
            : '회고를 공개로 전환'
          : undefined
      }
      className="-mx-7.5 px-5"
    />
  );
}
