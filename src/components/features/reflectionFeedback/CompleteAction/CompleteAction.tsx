'use client';

import Button from '@/src/components/ui/Button/Button';

import { useRewardUnlock } from '../../reward/hooks/useRewardUnlock';

const CompleteAction = () => {
  const { isChecking, start } = useRewardUnlock();

  return <Button label="완료" onClick={start} disabled={isChecking} />;
};

export default CompleteAction;
