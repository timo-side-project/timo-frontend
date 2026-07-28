'use client';

import { useRouter } from 'next/navigation';

import PageHeader from '@/src/components/layout/PageHeader/PageHeader';
import Icon from '@/src/components/ui/Icon/Icon';

const ProfileHeader = () => {
  const router = useRouter();

  const handleThemeClick = () => {
    router.push('/profile/theme');
  };

  return (
    <PageHeader
      title="마이페이지"
      className="fixed top-0 left-1/2 z-50 w-full max-w-110 -translate-x-1/2 px-7.5"
      rightIcon={<Icon name="editTheme" size={20} />}
      onRightClick={handleThemeClick}
    />
  );
};

export default ProfileHeader;
