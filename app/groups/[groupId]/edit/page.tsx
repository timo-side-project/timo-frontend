import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import GroupEditForm from '@/src/components/features/groups/GroupEditForm/GroupEditForm';
import PageHeader from '@/src/components/layout/PageHeader/PageHeader';
import Icon from '@/src/components/ui/Icon/Icon';

interface PageProps {
  params: Promise<{ groupId: string }>;
}

export default async function Page({ params }: PageProps) {
  const { groupId: groupIdParam } = await params;
  const groupId = Number(groupIdParam);

  if (!Number.isInteger(groupId)) notFound();

  return (
    <>
      <PageHeader
        title="그룹 수정하기"
        leftIcon={
          <Link href="/groups">
            <Icon name="chevronLeft" size={28} alt="뒤로가기" />
          </Link>
        }
        className="fixed top-0 left-1/2 z-50 w-full max-w-110 -translate-x-1/2 bg-g-700 px-7.5"
      />
      <Suspense>
        <GroupEditForm groupId={groupId} />
      </Suspense>
    </>
  );
}
