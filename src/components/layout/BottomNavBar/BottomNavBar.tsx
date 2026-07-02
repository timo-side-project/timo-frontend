'use client';

import { usePathname } from 'next/navigation';

import type { IconNameType } from '@/src/components/ui/Icon/Icon.types';

import BottomNavButton, { type TabKey } from './BottomNavButton';

interface BottomTabItem {
  key: TabKey;
  activeIconName: IconNameType;
  inactiveIconName: IconNameType;
  href: string;
}

const bottomTabs: BottomTabItem[] = [
  {
    key: 'home',
    activeIconName: 'homeActive',
    inactiveIconName: 'homeInactive',
    href: '/',
  },
  {
    key: 'calendar',
    activeIconName: 'calendarActive',
    inactiveIconName: 'calendarInactive',
    href: '/calendar',
  },
  {
    key: 'statistics',
    activeIconName: 'statisticsActive',
    inactiveIconName: 'statisticsInactive',
    href: '/statistics',
  },
  {
    key: 'groups',
    activeIconName: 'groupsActive',
    inactiveIconName: 'groupsInactive',
    href: '/groups',
  },
  {
    key: 'profile',
    activeIconName: 'userActive',
    inactiveIconName: 'userInactive',
    href: '/profile',
  },
];

const BottomNavBar = () => {
  const pathname = usePathname();
  const activeMenu: TabKey =
    bottomTabs.find((tab) => tab.href === pathname)?.key ?? 'home';

  return (
    <div className="fixed bottom-6 left-1/2 z-10 w-full max-w-110 -translate-x-1/2 px-5">
      <div className="flex items-center justify-center">
        <div className="flex w-full items-center justify-between rounded-full bg-g-0/10 backdrop-blur-[50px] px-6 py-3">
          {bottomTabs.map((tab) => (
            <BottomNavButton
              key={tab.key}
              tabKey={tab.key}
              href={tab.href}
              isActive={activeMenu === tab.key}
              activeIconName={tab.activeIconName}
              inactiveIconName={tab.inactiveIconName}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BottomNavBar;
