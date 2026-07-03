---
name: create-test
description: TIMO 프론트 컴포넌트 테스트 작성 — Storybook play 함수 기반 인터랙션 테스트와 렌더 스모크 테스트. "테스트 작성", "test 짜줘", "인터랙션 테스트", "이 컴포넌트 테스트" 요청 시 사용
---

# TIMO 컴포넌트 테스트

테스트는 **Storybook + Vitest 애드온**으로 실행한다 (브라우저 모드, chromium/playwright). 별도 `*.test.tsx` 파일을 만들지 않고 **스토리에 테스트를 얹는다.**

## 두 종류

1. **렌더 스모크 테스트**: 스토리(`*.stories.tsx`)가 존재하면 애드온이 자동으로 렌더 테스트로 실행한다. 즉 스토리를 잘 써두는 것 자체가 테스트다.
2. **인터랙션 테스트**: 스토리에 `play` 함수를 추가해 클릭·입력 등 동작을 검증한다.

## 인터랙션 테스트 패턴 (검증됨)

`storybook/test`에서 `fn`(스파이), `userEvent`, `within`, `expect`를 가져온다.

```typescript
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent, within } from 'storybook/test';

import Button from './Button';

const meta = {
  title: 'UI/Button',
  component: Button,
  args: { label: '기록 완료' },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// 클릭하면 onClick이 호출된다
export const Clickable: Story = {
  args: { label: '클릭', onClick: fn() },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: '클릭' });

    await userEvent.click(button);

    await expect(args.onClick).toHaveBeenCalledOnce();
  },
};
```

### 규칙
- 콜백 검증은 `fn()` 스파이를 `args`로 주입하고 `play`에서 호출 여부를 단언한다
- 요소는 **역할/접근 이름**으로 찾는다 (`getByRole('button', { name })`) — 접근성도 함께 검증됨
- `userEvent`·`expect`는 `await` 한다
- 폼: `userEvent.type(input, '값')` 후 제출 버튼 클릭 → 결과 단언
- import 경로는 `storybook/test` (Storybook 10). `@storybook/test` 아님

## 실행 & 검증

```bash
# 특정 컴포넌트만
pnpm exec vitest run --project storybook [ComponentName]
# 전체
pnpm exec vitest run --project storybook
```

작성 후 반드시 위 명령으로 **실제 통과를 확인**한다. `pnpm typecheck`도 통과해야 한다.

## 접근성

`@storybook/addon-a11y`가 스토리 렌더 시 axe 기반 접근성 검사를 함께 수행한다. 코드 레벨의 접근성 전수 감사는 `a11y-audit` 에이전트를 사용한다.
