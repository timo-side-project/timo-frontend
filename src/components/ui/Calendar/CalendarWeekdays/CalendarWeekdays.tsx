'use client';

const WEEKDAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'] as const;

const CalendarWeekdays = () => {
  return (
    <ul className="grid grid-cols-7 text-center font-body-s text-g-20">
      {WEEKDAY_LABELS.map((label) => (
        <li key={label} className="py-1">
          {label}
        </li>
      ))}
    </ul>
  );
};

export default CalendarWeekdays;
