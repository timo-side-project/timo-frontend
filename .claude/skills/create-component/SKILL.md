---
name: create-component
description: TIMO 프론트 UI 컴포넌트 스캐폴딩 — components/ui 규칙에 맞는 컴포넌트 파일과 Storybook 스토리 생성. "컴포넌트 만들어", "UI 컴포넌트", "버튼/모달 등 컴포넌트 작성" 시 사용
---

# TIMO 컴포넌트 스캐폴딩

## 배치 결정 (먼저)

컴포넌트가 어디 종속인지 판단해 위치를 정한다. 어느 쪽이든 **자기 폴더 + `[Name]/[Name].tsx`** 방식은 동일.

- **범용(어디서든 재사용, 특정 기능에 안 묶임)** → `src/components/ui/[Name]/[Name].tsx`
  - import 방향: `ui`는 `features`를 참조하면 안 됨
- **특정 feature 전용** → `src/components/features/[feature]/[Name]/[Name].tsx`
  - 해당 feature 안에서만 사용. 다른 feature에서 직접 참조 금지
  - 공통으로 쓰이기 시작하면 `ui/`로 승격
- 애매하면 우선 feature 안에 두고, 재사용 필요해지면 `ui/`로 옮긴다

## 규칙

- `ComponentProps<'element'>`를 확장해 네이티브 props 상속
- **default export**
- 조건부 클래스는 `cn()` 헬퍼 (`@/src/lib/helpers/cn`)
- 색상/간격 등은 **디자인 토큰만** — 임의 값 금지 (`bg-g-0`, `text-g-100` 등)
- 배럴(`index.ts`) 임포트 금지 — 직접 경로
- 무거운 컴포넌트는 `next/dynamic`으로 동적 임포트 (예: Calendar는 `ssr: false`)

## 컴포넌트 (`[Name].tsx`)

```typescript
import { type ComponentProps } from 'react';

import { cn } from '@/src/lib/helpers/cn';

interface ButtonProps extends ComponentProps<'button'> {
  label: string;
  variant?: 'primary' | 'secondary';
  size?: 'l' | 's';
}

const Button = ({
  label,
  variant = 'primary',
  size = 'l',
  className,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={cn(
        'rounded-lg font-medium',
        variant === 'primary' ? 'bg-primary text-g-900' : 'bg-g-100 text-g-700',
        size === 'l' ? 'h-12 px-6' : 'h-9 px-4',
        className,
      )}
      {...props}
    >
      {label}
    </button>
  );
};

export default Button;
```

## 스토리 (`[Name].stories.tsx`)

컴포넌트와 같은 위치에 작성.

```typescript
import type { Meta, StoryObj } from '@storybook/react';

import Button from './Button';

const meta = {
  // 범용: 'ui/[Name]', feature 전용: 'features/[feature]/[Name]'
  title: 'ui/Button',
  component: Button,
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: { label: '확인', variant: 'primary' },
};
```

## 검증

작성 후 `pnpm typecheck`, `pnpm lint` 통과 확인. 기존 스토리 파일에서 실제 `Meta` import 경로를 맞춰 사용한다.
