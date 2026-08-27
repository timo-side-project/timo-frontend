import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { format, setDate, startOfMonth } from 'date-fns';

import { useCalendarState } from '@/src/hooks/useCalendarState';
import { CALENDAR_DATE_FORMAT } from '@/src/lib/constants/calendar';
import type { CalendarDayMark } from '@/src/types/calendar';

import Calendar from './Calendar';

const monthStart = startOfMonth(new Date());

const dayKey = (day: number) =>
  format(setDate(monthStart, day), CALENDAR_DATE_FORMAT.dayKey);

const publicMarks = new Map<string, CalendarDayMark>([
  [dayKey(1), { categoryType: 'past-negative' }],
  [dayKey(3), { categoryType: 'past-positive' }],
  [dayKey(4), { categoryType: 'present-hedonistic' }],
  [dayKey(6), { categoryType: 'present-fatalistic' }],
  [dayKey(7), { categoryType: 'future-oriented' }],
]);

interface CalendarPreviewProps {
  marksByDate: Map<string, CalendarDayMark>;
}

/** 상태 훅과 묶어 실제 사용 형태로 보여준다 */
const CalendarPreview = ({ marksByDate }: CalendarPreviewProps) => {
  const calendarState = useCalendarState();

  return (
    <Calendar
      currentMonthLabel={calendarState.currentMonthLabel}
      days={calendarState.days}
      currentMonth={calendarState.currentMonth}
      today={calendarState.today}
      selectedDate={calendarState.selectedDate}
      marksByDate={marksByDate}
      onPrevMonth={calendarState.goPrevMonth}
      onNextMonth={calendarState.goNextMonth}
      onSelectDate={calendarState.selectDate}
    />
  );
};

const meta = {
  title: 'UI/Calendar',
  component: Calendar,
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  tags: ['autodocs'],
  // 실제 렌더는 CalendarPreview가 상태 훅과 함께 담당한다
  args: {
    currentMonthLabel: format(monthStart, CALENDAR_DATE_FORMAT.monthLabel),
    days: [],
    currentMonth: monthStart,
    today: new Date(),
    selectedDate: null,
    marksByDate: publicMarks,
    onPrevMonth: () => {},
    onNextMonth: () => {},
    onSelectDate: () => {},
  },
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 내 캘린더: 기록 없는 날도 회색 배경 */
export const Default: Story = {
  render: () => <CalendarPreview marksByDate={publicMarks} />,
};
