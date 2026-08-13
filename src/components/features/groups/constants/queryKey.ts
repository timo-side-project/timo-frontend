import type { SortValue } from './groupSort';

export const groupKeys = {
  all: () => ['groups'] as const,
  list: () => [...groupKeys.all(), 'list'] as const,
  friendList: (groupId: number, sort: SortValue) =>
    [...groupKeys.all(), 'friendList', groupId, sort] as const,
  detail: (groupId: number) => [...groupKeys.all(), 'detail', groupId] as const,
  create: () => [...groupKeys.all(), 'create'] as const,
  joinGroup: () => [...groupKeys.all(), 'joinGroup'] as const,
  update: (groupId: number) => [...groupKeys.all(), 'update', groupId] as const,
  delete: (groupId: number) => [...groupKeys.all(), 'delete', groupId] as const,
  leave: (groupId: number) => [...groupKeys.all(), 'leave', groupId] as const,
};
