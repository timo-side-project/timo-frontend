import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
} from 'date-fns';

export const formatRelativeTime = (dateString: string): string => {
  const target = new Date(dateString);
  const now = new Date();

  const minutes = differenceInMinutes(now, target);
  if (minutes < 1) return '방금';
  if (minutes < 60) return `${minutes}분 전`;

  const hours = differenceInHours(now, target);
  if (hours < 24) return `${hours}시간 전`;

  const days = differenceInDays(now, target);
  return `${days}일 전`;
};
