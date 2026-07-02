'use client';

import Link from 'next/link';

import Icon from '@/src/components/ui/Icon/Icon';
import type { IconNameType } from '@/src/components/ui/Icon/Icon.types';

export type TabKey = 'home' | 'calendar' | 'statistics' | 'groups' | 'profile';

type BottomNavButtonProps = {
  tabKey: TabKey;
  href: string;
  isActive: boolean;
  activeIconName: IconNameType;
  inactiveIconName: IconNameType;
};

const BottomNavButton = ({
  tabKey,
  href,
  isActive,
  activeIconName,
  inactiveIconName,
}: BottomNavButtonProps) => {
  const iconName = isActive ? activeIconName : inactiveIconName;

  return (
    <Link
      href={href}
      prefetch
      className="flex h-12 w-12 items-center justify-center"
      aria-current={isActive ? 'page' : undefined}
      aria-label={tabKey}
    >
      <Icon name={iconName} size={28} alt={tabKey} />
    </Link>
  );
};

export default BottomNavButton;
