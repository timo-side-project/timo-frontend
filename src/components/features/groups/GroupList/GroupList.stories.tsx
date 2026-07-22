import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { expect, fireEvent, fn, waitFor, within } from 'storybook/test';

import RankingItem from '@/src/components/features/groups/Ranking/RankingItem/RankingItem';

import GroupList from './GroupList';

const meta = {
  title: 'Features/Groups/GroupList',
  component: GroupList,
  parameters: {
    layout: 'fullscreen',
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof GroupList>;

export default meta;

type Story = StoryObj<typeof meta>;

const groups = [
  { id: 1, name: '친구 많은 모임', type: 'FRIEND' as const, image: '' },
  { id: 2, name: '어떤 모임', type: 'FRIEND' as const, image: '' },
  { id: 3, name: '친구 모임', type: 'FRIEND' as const, image: '' },
  { id: 4, name: '어떤 모임', type: 'FRIEND' as const, image: '' },
  { id: 5, name: '친구 모임', type: 'FRIEND' as const, image: '' },
  { id: 6, name: '어떤 모임', type: 'FRIEND' as const, image: '' },
  { id: 7, name: '친구 모임', type: 'FRIEND' as const, image: '' },
  { id: 8, name: '어떤 모임', type: 'FRIEND' as const, image: '' },
  { id: 9, name: '친구 모임', type: 'FRIEND' as const, image: '' },
  { id: 10, name: '어떤 모임', type: 'FRIEND' as const, image: '' },
];

const longNameGroups = [
  {
    id: 1,
    name: '친구정말많은모임이름입니다',
    type: 'FRIEND' as const,
    image: '',
  },
  {
    id: 2,
    name: '우리들의 아주 긴 모임 이름 입니다 친구가 정말정말 많아요',
    type: 'FRIEND' as const,
    image: '',
  },
  { id: 3, name: '짧은 모임', type: 'FRIEND' as const, image: '' },
];

export const Default: Story = {
  render: () => {
    const [selectedId, setSelectedId] = useState(1);
    return (
      <GroupList
        groups={groups}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />
    );
  },
  args: { groups },
};

export const LongName: Story = {
  render: () => {
    const [selectedId, setSelectedId] = useState(1);
    return (
      <GroupList
        groups={longNameGroups}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />
    );
  },
  args: { groups: longNameGroups },
};

// 리스트를 스크롤하면 바늘(세모) 아래로 지나가는 그룹이 자동으로 포커스된다
export const DialScroll: Story = {
  args: { groups, onSelect: fn() },
  render: (args) => {
    const [selectedId, setSelectedId] = useState(1);
    return (
      <div style={{ width: 393 }}>
        <GroupList
          groups={groups}
          selectedId={selectedId}
          onSelect={(id) => {
            args.onSelect?.(id);
            setSelectedId(id);
          }}
        />
      </div>
    );
  },
  play: async ({ args, canvasElement }) => {
    const scrollContainer = canvasElement.querySelector(
      '.overflow-x-auto',
    ) as HTMLElement;

    // 사용자가 리스트를 드래그/휠 스크롤한 상황을 재현한다
    scrollContainer.scrollLeft = 180;
    scrollContainer.dispatchEvent(new Event('scroll'));
    scrollContainer.dispatchEvent(new Event('scrollend'));

    // scrollend 미지원 환경의 debounce(120ms) 폴백까지 여유를 두고 폴링한다
    await waitFor(() => expect(args.onSelect).toHaveBeenCalled());

    const canvas = within(canvasElement);
    const focusedButton = canvas.getAllByRole('button', { pressed: true })[0];
    await expect(focusedButton).toBeVisible();
  },
};

// 스크롤이 끝까지 닿지 않는 마지막 그룹을 클릭하면, 바늘이 실제로 멈춘
// 그룹 위치로 이동한다 (바늘의 원래 고정 위치까지 못 오는 경계 케이스)
export const DialEdgeClick: Story = {
  args: { groups, onSelect: fn() },
  render: (args) => {
    const [selectedId, setSelectedId] = useState(1);
    return (
      <div style={{ width: 393 }}>
        <GroupList
          groups={groups}
          selectedId={selectedId}
          onSelect={(id) => {
            args.onSelect?.(id);
            setSelectedId(id);
          }}
        />
      </div>
    );
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const buttons = canvas.getAllByRole('button');
    const lastButton = buttons[buttons.length - 1];
    const lastGroup = groups[groups.length - 1];

    // userEvent.click은 클릭 전에 요소를 자동으로 scrollIntoView 시켜
    // 다이얼의 자체 스크롤 추적 로직과 충돌한다. 순수 클릭 이벤트만 보내는
    // fireEvent를 사용해 리스트 밖으로 스크롤된 그룹을 실제로 클릭한 것처럼 재현한다.
    fireEvent.click(lastButton);
    await waitFor(() =>
      expect(args.onSelect).toHaveBeenCalledWith(lastGroup.id),
    );

    await waitFor(() => {
      const indicator = canvasElement.querySelector(
        '.border-b-g-500',
      ) as HTMLElement;
      const lastRect = lastButton.parentElement!.getBoundingClientRect();
      const indicatorRect = indicator.getBoundingClientRect();

      const lastCenterX = Math.round(lastRect.left + lastRect.width / 2);
      const indicatorCenterX = Math.round(
        indicatorRect.left + indicatorRect.width / 2,
      );

      expect(indicatorCenterX).toBe(lastCenterX);
    });
  },
};

// GroupList 다이얼과 (실제 API를 타는 RankingSection 대신) 친구 랭킹 UI를
// 나란히 붙여서, 그룹을 스크롤/클릭할 때 아래 랭킹도 함께 바뀌는지 리뷰어가
// 직접 확인할 수 있게 한다.
// RankingSection은 src/lib/api/instance.ts가 next/navigation의
// unstable_rethrow를 가져오는데, Storybook의 Next.js 목이 이를 지원하지 않아
// 스토리에서 임포트하면 깨진다. 그래서 API 의존이 없는 RankingItem을 목 데이터로
// 직접 그려서 같은 UI/동선을 재현한다.
const mockFriendsByGroupId: Record<
  number,
  { nickname: string; answerText: string; streakDays: number }[]
> = Object.fromEntries(
  groups.map((group) => [
    group.id,
    [
      {
        nickname: `${group.name} 멤버1`,
        answerText: '친구들이랑 저녁 먹은 거요!',
        streakDays: 12,
      },
      {
        nickname: `${group.name} 멤버2`,
        answerText: '오늘은 그냥 쉬었어요.',
        streakDays: 3,
      },
    ],
  ]),
);

export const WithFriendRanking: Story = {
  args: { groups },
  render: () => {
    const [selectedGroupId, setSelectedGroupId] = useState(groups[0].id);
    const friends = mockFriendsByGroupId[selectedGroupId] ?? [];

    return (
      <div style={{ width: 393 }}>
        <GroupList
          groups={groups}
          selectedId={selectedGroupId}
          onSelect={setSelectedGroupId}
        />
        <ul className="bg-g-500 space-y-8 px-5 py-6">
          {friends.map((friend, index) => (
            <RankingItem
              key={friend.nickname}
              isExistImg
              nickname={friend.nickname}
              answerText={friend.answerText}
              streakDays={friend.streakDays}
              ranking={index + 1}
              userCategory="PRESENT_HEDONISTIC"
              onClick={() => {}}
            />
          ))}
        </ul>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 처음엔 첫 그룹의 멤버가 랭킹에 보인다
    await expect(canvas.getByText('친구 많은 모임 멤버1')).toBeInTheDocument();

    // 리스트를 두 번째 그룹 위치까지 스크롤하면
    const scrollContainer = canvasElement.querySelector(
      '.overflow-x-auto',
    ) as HTMLElement;
    scrollContainer.scrollLeft = 86;
    scrollContainer.dispatchEvent(new Event('scroll'));
    scrollContainer.dispatchEvent(new Event('scrollend'));

    // 랭킹도 두 번째 그룹 멤버로 함께 바뀐다
    await waitFor(() =>
      expect(canvas.getByText('어떤 모임 멤버1')).toBeInTheDocument(),
    );
    await expect(
      canvas.queryByText('친구 많은 모임 멤버1'),
    ).not.toBeInTheDocument();
  },
};
