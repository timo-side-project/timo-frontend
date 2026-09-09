'use client';

import { useRouter } from 'next/navigation';

import PageHeader from '@/src/components/layout/PageHeader/PageHeader';
import Icon from '@/src/components/ui/Icon/Icon';
import { goBackOrHome } from '@/src/lib/helpers/navigation';

export default function FriendReflectionHeader() {
  const router = useRouter();

  return (
    <PageHeader
      title="친구 회고"
      leftIcon={<Icon name="chevronLeft" size={25} />}
      onLeftClick={() => goBackOrHome(router)}
      className="-mx-7.5 px-5"
    />
  );
}
