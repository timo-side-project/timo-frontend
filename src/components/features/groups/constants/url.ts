export const GROUP_ENDPOINT = {
  groups: '/groups',
  group: (groupId: number) => `/groups/${groupId}`,
  friendList: (groupId: number) => `/groups/${groupId}/reflections/today`,
  joinGroup: '/groups/members',
  leaveGroup: (groupId: number) => `/groups/${groupId}/members`,
} as const;

export const IMAGE_ENDPOINT = {
  upload: '/images',
} as const;
