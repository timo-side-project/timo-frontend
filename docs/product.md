# 제품 개요

**TIMO**는 ZTPI(짐바르도 시간관점 검사) 기반의 시간관점 회고 저널링 앱이다. 사용자는 매일의 회고를 시간관점 카테고리로 기록하고, AI 피드백·캐릭터 성장·그룹 공유를 통해 지속적으로 회고 습관을 이어간다.

라우트·디렉토리 구조는 [architecture.md](./architecture.md), 코드 컨벤션은 [conventions.md](./conventions.md) 참고. 이 문서는 **기능이 왜 존재하고 무엇을 해야 하는지**만 다룬다 — 구현 방식은 코드/architecture.md가 기준.

## 핵심 도메인 개념

### 시간관점 카테고리 (Time Perspective)

ZTPI 검사 결과로 사용자를 5개 카테고리 중 하나로 분류한다 (`src/lib/constants/character.ts`의 `Category` 타입):

| 카테고리             | 의미                    |
| -------------------- | ----------------------- |
| `PAST_NEGATIVE`      | 부정적인 과거 기억 중심 |
| `PAST_POSITIVE`      | 긍정적인 과거 기억 중심 |
| `PRESENT_HEDONISTIC` | 현재의 즐거움 중심      |
| `PRESENT_FATALISTIC` | 현재를 있는 그대로 수용 |
| `FUTURE`             | 미래 지향               |

회고를 쓸 때마다 해당 회고가 어느 카테고리에 속하는지 태깅되고, 이 카테고리 값이 회고 피드백 메시지(`src/lib/constants/categoryMessages.ts`)·캐릭터·통계 그래프의 기준이 된다.

### 캐릭터 (Characters)

시간관점 카테고리별로 캐릭터가 매핑돼 있다. `/characters`에서 카테고리별 캐릭터를 확인/선택할 수 있고, 그룹 참여 방식 중 하나(캐릭터 그룹)도 이 캐릭터 단위로 묶인다.

| 카테고리             | 캐릭터 이름 |
| -------------------- | ----------- |
| `PAST_NEGATIVE`      | 그늘이      |
| `PAST_POSITIVE`      | 추억이      |
| `PRESENT_HEDONISTIC` | 지금이      |
| `PRESENT_FATALISTIC` | 담담이      |
| `FUTURE`             | 내일이      |

### 커스터마이징 & 리워드 (Customization & Reward)

회고 누적 횟수에 따라 테마가 순차 해금(unlock)된다: 학교 5회 / 놀이터공원 10회 / 수영장 15회 / 집 20회 / 우주 30회, 나의 시간관 펫은 **연속** 30회(연속 실패 시 펫 사라짐). 회고 피드백 완료 시 새로 해금된 항목이 있으면 `/reward`로 진입해 획득 연출을 보여준다. 해금된 항목은 프로필 테마(`/profile/theme`)에서 장착할 수 있다.

## 기능별 요약

### 온보딩 & 로그인 (`/onboarding`, `/login`)

서비스 소개(Introduction) 후 로그인. 최초 로그인 사용자는 온보딩 미완료 상태(`isOnboarded: false`)로 판단되면 ZTPI 성격 테스트로 유도된다 (`app/(home)/page.tsx` 서버 컴포넌트에서 분기).

### ZTPI 성격 테스트 (`/ztpi-test`, `/ztpi-test/complete`, `/ztpi/[ztpiTestId]`)

사용자의 시간관점 카테고리를 판별하는 온보딩 필수 절차. 완료 시 캐릭터·회고 카테고리 태깅의 기준값이 저장된다. 마이페이지에서 언제든 재응시 가능.

### 회고 (`/reflection`, `/reflection/[reflectionId]`, `/reflection/[reflectionId]/feedback`)

- 회고 작성 → 시간관점 카테고리 태깅 → AI 피드백 생성(`reflectionFeedback` 기능, `GeneratingFeedbackCard` → `ResultCard`) → 완료 액션(`CompleteAction`)
- 피드백 완료 후 새 커스터마이징 해금분이 있으면 `/reward`로 안내
- 회고는 `isMine`/`isPublic` 상태를 가진다 — 본인 회고면 헤더가 "나의 회고"로 표시되고, 공개 여부를 토글해 그룹 내 다른 사람이 볼 수 있는지 결정한다

### 그룹 회고 (`/groups`, `/groups/create`, `/groups/[groupId]/edit`)

- 그룹은 두 가지 참여 방식으로 만들 수 있다: **캐릭터 그룹**(같은 시간관점 카테고리 캐릭터 기준) / **친구 그룹**(직접 초대)
- 그룹 안에서 멤버의 공개(`isPublic`) 회고를 확인할 수 있다 (`FriendReflectionPanel`)
- 랭킹(`Ranking`)으로 그룹 멤버를 연속 기록일수(`streakDays`) 기준 비교할 수 있고, "이번 달 가장 많이 쓴 단어" 랭킹도 있다 (PR 존재, main 미머지)
- 그룹 생성자는 그룹 정보 수정·삭제·멤버 관리, 멤버는 그룹 나가기 가능

### 캘린더 (`/calendar`)

날짜별로 작성한 회고를 조회하는 뷰. 상단에 연속 기록일수 배너(`StreakBanner`)를 보여준다.

### 통계 (`/statistics`)

기간별로 자신의 시간관점 카테고리 분포·근접도(이상치와의 거리) 변화를 그래프(`DataGraph`)로 보여준다. 미들웨어로 인증 가드가 걸려 있는 라우트.

### 프로필 (`/profile`, `/profile/nickname`, `/profile/theme`)

닉네임 변경, 해금된 테마 장착, 알림 수신·시간 설정, 회원 탈퇴(`WithdrawModal` — 탈퇴 시 회고·기록 전체 삭제, 복구 불가) 등 계정 관리.

### 알림 (`/notification`)

FCM 기반 푸시 알림 목록 (`src/lib/firebase/`).

## 용어집

| 용어                    | 뜻                                                                                 |
| ----------------------- | ---------------------------------------------------------------------------------- |
| ZTPI                    | Zimbardo Time Perspective Inventory — 시간관점 성격 검사                           |
| 시간관점 카테고리       | 위 5개 `Category` 값 중 하나                                                       |
| isMine                  | 조회 중인 회고가 본인 것인지 여부                                                  |
| isPublic                | 회고를 그룹 멤버에게 공개했는지 여부 (구 필드명 `isPrivate`에서 의미 반전 후 개명) |
| 캐릭터 그룹 / 친구 그룹 | 그룹 생성·참여 방식 두 가지                                                        |
| 해금(unlock)            | 회고 활동으로 커스터마이징 요소를 획득하는 것                                      |

## 기능 상세가 더 필요할 때

이 문서는 개요·목차용으로만 유지한다. 기능별 상세 명세(규칙·예외·확인 필요)는 `docs/product/[feature].md`에 있다.

| 문서 | 범위 |
| --- | --- |
| [auth-onboarding.md](./product/auth-onboarding.md) | 인증 가드, 온보딩, 로그인, 하단 탭바, 앱 설치 안내 |
| [ztpi.md](./product/ztpi.md) | ZTPI 테스트, 결과, 캐릭터 소개 |
| [reflection.md](./product/reflection.md) | 홈, 회고 작성·상세, AI 피드백, 서비스 피드백 |
| [groups.md](./product/groups.md) | 그룹 목록·생성·참여·관리, 친구 회고, 좋아요·댓글 |
| [calendar.md](./product/calendar.md) | 캘린더, 연속 기록 배너 |
| [statistics.md](./product/statistics.md) | 시간관 변화 통계 |
| [reward.md](./product/reward.md) | 보상 획득, 테마·펫 선택 |
| [profile.md](./product/profile.md) | 마이페이지, 닉네임, 알림 설정, 로그아웃·탈퇴, 알림 목록 |

각 문서 상단 frontmatter의 `sources`(소스 경로 glob)·`routes`는 코드 변경과 문서를 연결하는 기준이다. 해당 경로의 동작을 바꾸면 문서도 함께 갱신한다.
