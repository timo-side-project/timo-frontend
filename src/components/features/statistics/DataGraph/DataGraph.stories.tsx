import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import DataGraph from './DataGraph';

const IDEAL_SCORE = 70;

const BAR_DATA = [
  { score: 55, createdAt: new Date('2026-06-17') },
  { score: 78, createdAt: new Date('2026-06-18') },
  { score: 62, createdAt: new Date('2026-06-19') },
  { score: 83, createdAt: new Date('2026-06-20') },
  { score: 69, createdAt: new Date('2026-06-21') },
  { score: 88, createdAt: new Date('2026-06-22') },
  { score: 74, createdAt: new Date('2026-06-23') },
];

const LINE_DATA = [
  { score: 48, createdAt: new Date('2026-03-24') },
  { score: 55, createdAt: new Date('2026-04-05') },
  { score: 52, createdAt: new Date('2026-04-18') },
  { score: 63, createdAt: new Date('2026-05-02') },
  { score: 71, createdAt: new Date('2026-05-15') },
  { score: 68, createdAt: new Date('2026-05-28') },
  { score: 79, createdAt: new Date('2026-06-10') },
  { score: 85, createdAt: new Date('2026-06-24') },
];

const meta = {
  title: 'Features/Statistics/DataGraph',
  component: DataGraph,
  parameters: {
    layout: 'fullscreen',
    viewport: { defaultViewport: 'mobile1' },
  },
  tags: ['autodocs'],
  args: {
    idealScore: IDEAL_SCORE,
    startLabel: '1주 전',
    chartType: 'bar',
    dataPoints: BAR_DATA,
  },
} satisfies Meta<typeof DataGraph>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Bar: Story = {};

export const Line: Story = {
  args: {
    chartType: 'line',
    startLabel: '3달 전',
    dataPoints: LINE_DATA,
  },
};

export const Empty: Story = {
  args: {
    dataPoints: [],
  },
};
