---
name: create-api-hook
description: TIMO 프론트 API 연동 코드 생성 — 엔드포인트 상수, 쿼리 키, Zod 스키마, React Query 조회/변경 훅. "API 추가", "쿼리 훅", "mutation", "데이터 페칭", "Swagger 붙이기" 작업 시 사용
---

# TIMO API 연동 패턴

새 API를 붙일 때 아래 순서로 파일을 만든다. import 별칭은 `@/src/...`, HTTP는 `src/lib/api`의 `get/post/patch/del` 래퍼만 쓴다 (axios 직접 호출 금지).

위치: `src/components/features/[feature]/`

## Phase 1: 엔드포인트 상수 (`constants/url.ts`)

```typescript
export const NOTIFICATION_ENDPOINTS = {
  history: '/notifications/histories/me',
  historyById: (historyId: number) => `/notifications/histories/${historyId}`,
} as const;
```

## Phase 2: 쿼리 키 팩토리 (`constants/queryKeys.ts`)

```typescript
export const notificationKeys = {
  all: ['notifications'] as const,
  history: () => [...notificationKeys.all, 'history'] as const,
};
```

## Phase 3: 조회 훅 (`queries/useXxxQuery.ts`)

Zod 스키마 → `z.infer` 타입 → `get<T>`에 `responseSchema` 전달 → `useQuery`.

```typescript
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';

import { get } from '@/src/lib/api';

import { notificationKeys } from '../constants/queryKeys';
import { NOTIFICATION_ENDPOINTS } from '../constants/url';

const notificationsHistorySchema = z.array(
  z.object({
    id: z.number(),
    notifiedAt: z.coerce.date(),
    title: z.string(),
  }),
);

export type NotificationsHistoryResponse = z.infer<
  typeof notificationsHistorySchema
>;

const getNotificationsHistory = async () =>
  get<NotificationsHistoryResponse>(NOTIFICATION_ENDPOINTS.history, {
    responseSchema: notificationsHistorySchema,
  });

export const useNotificationHistoriesQuery = () =>
  useQuery({
    queryKey: notificationKeys.history(),
    queryFn: getNotificationsHistory,
  });
```

- Suspense가 필요하면 `useSuspenseQuery`로 동일하게 작성.

## Phase 4: 변경 훅 (`queries/useXxxMutation.ts`)

```typescript
import { useMutation } from '@tanstack/react-query';

import { post } from '@/src/lib/api';

import { testAuthKeys } from '../constants/queryKeys';
import { TEST_AUTH_ENDPOINTS } from '../constants/url';

const login = async (email: string): Promise<void> =>
  post<{ email: string }, void>(TEST_AUTH_ENDPOINTS.login, { email });

export const useLoginMutation = () =>
  useMutation({
    mutationKey: testAuthKeys.login(),
    mutationFn: login,
  });
```

- 래퍼 시그니처: `get<TResponse, TParams>`, `post<TRequest, TResponse, TParams>`, `patch<TRequest, TResponse>`, `del<TRequest, TResponse>`
- 변경 후 관련 쿼리 무효화가 필요하면 `queryClient.invalidateQueries({ queryKey: keys })` 사용

## 검증

작성 후 `pnpm typecheck`, `pnpm lint` 통과 확인.
