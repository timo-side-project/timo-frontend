import type { SortValue } from './groupSort';

export const groupKeys = {
  all: () => ['groups'] as const,
  list: () => [...groupKeys.all(), 'list'] as const,
  friendList: (groupId: number, sort: SortValue) =>
    [...groupKeys.all(), 'friendList', groupId, sort] as const,
  friendListByGroup: (groupId: number) =>
    [...groupKeys.all(), 'friendList', groupId] as const,
  create: () => [...groupKeys.all(), 'create'] as const,
  joinGroup: () => [...groupKeys.all(), 'joinGroup'] as const,
  update: (groupId: number) => [...groupKeys.all(), 'update', groupId] as const,
  delete: (groupId: number) => [...groupKeys.all(), 'delete', groupId] as const,
  leave: (groupId: number) => [...groupKeys.all(), 'leave', groupId] as const,
  reflectionDetail: (groupId: number, reflectionId: number) =>
    [...groupKeys.all(), 'reflectionDetail', groupId, reflectionId] as const,
  comments: (groupId: number, reflectionId: number) =>
    [...groupKeys.all(), 'comments', groupId, reflectionId] as const,
  toggleLike: () => [...groupKeys.all(), 'like', 'toggle'] as const,
  createComment: () => [...groupKeys.all(), 'comments', 'create'] as const,
  updateComment: () => [...groupKeys.all(), 'comments', 'update'] as const,
  deleteComment: () => [...groupKeys.all(), 'comments', 'delete'] as const,
};
