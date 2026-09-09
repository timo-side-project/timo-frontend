export const GROUP_ENDPOINT = {
  groups: '/groups',
  group: (groupId: number) => `/groups/${groupId}`,
  friendList: (groupId: number) => `/groups/${groupId}/reflections/today`,
  joinGroup: '/groups/members',
  leaveGroup: (groupId: number) => `/groups/${groupId}/members`,
  reflectionDetail: (groupId: number, reflectionId: number) =>
    `/groups/${groupId}/reflections/${reflectionId}`,
  reflectionLike: (groupId: number, reflectionId: number) =>
    `/groups/${groupId}/reflections/${reflectionId}/like`,
  reflectionComments: (groupId: number, reflectionId: number) =>
    `/groups/${groupId}/reflections/${reflectionId}/comments`,
  reflectionComment: (
    groupId: number,
    reflectionId: number,
    commentId: number,
  ) => `/groups/${groupId}/reflections/${reflectionId}/comments/${commentId}`,
} as const;

export const IMAGE_ENDPOINT = {
  upload: '/images',
} as const;
